import { createHash, randomBytes } from "crypto";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/db";
import { getDownloadConfig } from "@/lib/config";
import {
  calculateOrderTotals,
  validateCheckoutLines,
} from "@/lib/checkout";
import type { CheckoutCustomer, CheckoutLineInput } from "@/lib/payments/types";
import type { PaymentNotification } from "@/lib/payments/types";

export function generateOrderReference(): string {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `TMC-${stamp}-${nanoid(8).toUpperCase()}`;
}

export async function createOrderFromCart(input: {
  lines: CheckoutLineInput[];
  customer: CheckoutCustomer;
}) {
  const validated = await validateCheckoutLines(input.lines);
  const totals = calculateOrderTotals(validated);
  const reference = generateOrderReference();

  const order = await prisma.order.create({
    data: {
      reference,
      status: "AWAITING_PAYMENT",
      paymentStatus: "PENDING",
      customerEmail: input.customer.email.toLowerCase().trim(),
      customerName: input.customer.name.trim(),
      customerPhone: input.customer.phone?.trim() || null,
      companyName: input.customer.companyName?.trim() || null,
      shippingAddress: input.customer.shippingAddress?.trim() || null,
      currency: "EUR",
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      taxInclusive: totals.taxInclusive,
      items: {
        create: validated.map((line) => ({
          productId: line.productId,
          licenceOptionId: line.licenceOptionId,
          productName: line.productName,
          licenceName: line.licenceName,
          unitPriceCents: line.unitPriceCents,
          quantity: line.quantity,
          lineTotalCents: line.lineTotalCents,
        })),
      },
    },
    include: { items: true },
  });

  return order;
}

export async function applyPaymentNotification(
  notification: PaymentNotification,
): Promise<{ orderId: string; alreadyProcessed: boolean }> {
  if (!notification.signatureValid) {
    throw new Error("Invalid payment notification signature.");
  }
  if (!notification.orderReference) {
    throw new Error("Missing order reference in payment notification.");
  }

  const order = await prisma.order.findUnique({
    where: { reference: notification.orderReference },
    include: { items: true },
  });
  if (!order) {
    throw new Error("Order not found for payment notification.");
  }

  if (notification.providerEventId) {
    const existing = await prisma.paymentEvent.findUnique({
      where: {
        provider_providerEventId: {
          provider: notification.provider,
          providerEventId: notification.providerEventId,
        },
      },
    });
    if (existing?.processed) {
      return { orderId: order.id, alreadyProcessed: true };
    }
  }

  await prisma.paymentEvent.create({
    data: {
      orderId: order.id,
      provider: notification.provider,
      eventType: notification.status,
      providerEventId: notification.providerEventId,
      payloadJson: JSON.stringify(notification.rawPayload),
      processed: false,
    },
  });

  if (notification.status === "paid") {
    if (
      typeof notification.amountCents === "number" &&
      notification.amountCents !== order.totalCents
    ) {
      throw new Error("Payment amount does not match order total.");
    }

    if (order.paymentStatus === "CAPTURED" && order.status === "PAID") {
      await prisma.paymentEvent.updateMany({
        where: {
          provider: notification.provider,
          providerEventId: notification.providerEventId,
        },
        data: { processed: true },
      });
      return { orderId: order.id, alreadyProcessed: true };
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        paymentStatus: "CAPTURED",
        paymentProvider: notification.provider,
        providerRef: notification.providerRef || order.providerRef,
        paidAt: new Date(),
      },
    });

    await issueDigitalDownloads(order.id);

    await prisma.paymentEvent.updateMany({
      where: {
        provider: notification.provider,
        providerEventId: notification.providerEventId,
      },
      data: { processed: true },
    });

    return { orderId: order.id, alreadyProcessed: false };
  }

  if (notification.status === "failed" || notification.status === "cancelled") {
    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: notification.status === "cancelled" ? "CANCELLED" : "FAILED",
        paymentStatus: "FAILED",
        paymentProvider: notification.provider,
        providerRef: notification.providerRef || order.providerRef,
      },
    });
  }

  await prisma.paymentEvent.updateMany({
    where: {
      provider: notification.provider,
      providerEventId: notification.providerEventId,
    },
    data: { processed: true },
  });

  return { orderId: order.id, alreadyProcessed: false };
}

export async function issueDigitalDownloads(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: { include: { downloadFiles: { where: { active: true } } } },
        },
      },
    },
  });
  if (!order || order.paymentStatus !== "CAPTURED") return [];

  const cfg = getDownloadConfig();
  const expiresAt = new Date(Date.now() + cfg.ttlHours * 60 * 60 * 1000);
  const issued: Array<{ token: string; fileLabel: string }> = [];

  for (const item of order.items) {
    if (item.product.type !== "DIGITAL") continue;
    for (const file of item.product.downloadFiles) {
      const raw = randomBytes(32).toString("base64url");
      const tokenHash = createHash("sha256").update(raw).digest("hex");
      await prisma.downloadToken.create({
        data: {
          tokenHash,
          orderId: order.id,
          downloadFileId: file.id,
          expiresAt,
          maxDownloads: cfg.maxAttempts,
        },
      });
      issued.push({ token: raw, fileLabel: file.label });
    }
  }

  return issued;
}

export function hashDownloadToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
