import { beforeEach, describe, expect, it } from "vitest";
import { applyPaymentNotification } from "@/lib/orders";
import { prisma } from "@/lib/db";

describe("applyPaymentNotification idempotency", () => {
  beforeEach(async () => {
    await prisma.paymentEvent.deleteMany();
    await prisma.downloadToken.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.licenceOption.deleteMany();
    await prisma.downloadFile.deleteMany();
    await prisma.product.deleteMany();
  });

  it("marks paid once and treats duplicate event id as already processed", async () => {
    const product = await prisma.product.create({
      data: {
        slug: "webhook-item",
        name: "Webhook Item",
        shortDescription: "Item",
        description: "Item",
        status: "PUBLISHED",
        type: "PHYSICAL",
        priceCents: 1000,
        stock: 3,
      },
    });

    const order = await prisma.order.create({
      data: {
        reference: "TMC-WEBHOOK-1",
        status: "AWAITING_PAYMENT",
        paymentStatus: "PENDING",
        customerEmail: "buyer@example.com",
        customerName: "Buyer",
        currency: "EUR",
        subtotalCents: 840,
        taxCents: 160,
        shippingCents: 0,
        totalCents: 1000,
        taxInclusive: true,
        items: {
          create: [
            {
              productId: product.id,
              productName: product.name,
              unitPriceCents: 1000,
              quantity: 1,
              lineTotalCents: 1000,
            },
          ],
        },
      },
    });

    const notification = {
      provider: "mock",
      providerEventId: "evt_duplicate_1",
      orderReference: order.reference,
      providerRef: "mock_abc",
      status: "paid" as const,
      amountCents: 1000,
      currency: "EUR",
      rawPayload: { test: true },
      signatureValid: true,
    };

    const first = await applyPaymentNotification(notification);
    expect(first.alreadyProcessed).toBe(false);

    const paid = await prisma.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(paid.status).toBe("PAID");
    expect(paid.paymentStatus).toBe("CAPTURED");

    const second = await applyPaymentNotification(notification);
    expect(second.alreadyProcessed).toBe(true);

    const events = await prisma.paymentEvent.findMany({
      where: { orderId: order.id, providerEventId: "evt_duplicate_1" },
    });
    expect(events).toHaveLength(1);
  });
});
