import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PrismaClient } from "@prisma/client";
import { applyPaymentNotification } from "@/lib/orders";

const prisma = new PrismaClient();

describe("payment notification idempotency", () => {
  const reference = `TMC-TEST-${Date.now()}`;
  let orderId = "";
  let productId = "";

  beforeAll(async () => {
    const product = await prisma.product.findFirst({
      where: { status: "PUBLISHED" },
    });
    if (!product) throw new Error("Seed products required for this test");
    productId = product.id;

    const order = await prisma.order.create({
      data: {
        reference,
        status: "AWAITING_PAYMENT",
        paymentStatus: "PENDING",
        customerEmail: "test@example.com",
        customerName: "Test User",
        currency: "EUR",
        subtotalCents: product.priceCents,
        taxCents: 0,
        totalCents: product.priceCents,
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              unitPriceCents: product.priceCents,
              quantity: 1,
              lineTotalCents: product.priceCents,
            },
          ],
        },
      },
    });
    orderId = order.id;
  });

  afterAll(async () => {
    await prisma.downloadToken.deleteMany({ where: { orderId } });
    await prisma.paymentEvent.deleteMany({ where: { orderId } });
    await prisma.orderItem.deleteMany({ where: { orderId } });
    await prisma.order.deleteMany({ where: { id: orderId } });
    await prisma.$disconnect();
  });

  it("processes a paid event once and ignores duplicates", async () => {
    const eventId = `evt_${reference}`;
    const notification = {
      provider: "mock",
      providerEventId: eventId,
      orderReference: reference,
      providerRef: "mock_ref_1",
      status: "paid" as const,
      amountCents: undefined as number | undefined,
      currency: "EUR",
      rawPayload: { ok: true },
      signatureValid: true,
    };

    // amountCents undefined skips amount check; set from order
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    notification.amountCents = order.totalCents;

    const first = await applyPaymentNotification(notification);
    expect(first.alreadyProcessed).toBe(false);

    const second = await applyPaymentNotification(notification);
    expect(second.alreadyProcessed).toBe(true);

    const events = await prisma.paymentEvent.findMany({
      where: { orderId, providerEventId: eventId },
    });
    expect(events).toHaveLength(1);

    const paid = await prisma.order.findUniqueOrThrow({ where: { id: orderId } });
    expect(paid.status).toBe("PAID");
    expect(paid.paymentStatus).toBe("CAPTURED");
    expect(productId).toBeTruthy();
  });
});
