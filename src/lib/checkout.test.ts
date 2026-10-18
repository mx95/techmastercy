import { beforeEach, describe, expect, it } from "vitest";
import {
  calculateOrderTotals,
  CheckoutValidationError,
  validateCheckoutLines,
} from "@/lib/checkout";
import { prisma } from "@/lib/db";

describe("calculateOrderTotals", () => {
  it("computes inclusive tax from validated lines", () => {
    const totals = calculateOrderTotals([
      {
        productId: "p1",
        productSlug: "x",
        productName: "X",
        productType: "PHYSICAL",
        licenceOptionId: null,
        licenceName: null,
        unitPriceCents: 10000,
        quantity: 1,
        lineTotalCents: 10000,
      },
    ]);
    expect(totals.totalCents).toBe(10000);
    expect(totals.taxCents + totals.subtotalCents).toBe(10000);
    expect(totals.shippingCents).toBe(0);
    expect(totals.taxInclusive).toBe(true);
  });
});

describe("validateCheckoutLines", () => {
  beforeEach(async () => {
    await prisma.paymentEvent.deleteMany();
    await prisma.downloadToken.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.licenceOption.deleteMany();
    await prisma.downloadFile.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
  });

  it("rejects empty cart", async () => {
    await expect(validateCheckoutLines([])).rejects.toBeInstanceOf(
      CheckoutValidationError,
    );
  });

  it("rejects unpublished products", async () => {
    const product = await prisma.product.create({
      data: {
        slug: "draft-item",
        name: "Draft",
        shortDescription: "Draft",
        description: "Draft product",
        status: "DRAFT",
        type: "PHYSICAL",
        priceCents: 500,
        stock: 5,
      },
    });

    await expect(
      validateCheckoutLines([{ productId: product.id, quantity: 1 }]),
    ).rejects.toThrow(/unavailable/i);
  });

  it("accepts published products with stock", async () => {
    const product = await prisma.product.create({
      data: {
        slug: "live-item",
        name: "Live",
        shortDescription: "Live",
        description: "Live product",
        status: "PUBLISHED",
        type: "PHYSICAL",
        priceCents: 499,
        stock: 5,
      },
    });

    const lines = await validateCheckoutLines([
      { productId: product.id, quantity: 2 },
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0]?.lineTotalCents).toBe(998);
    expect(lines[0]?.unitPriceCents).toBe(499);
  });

  it("applies mini airtag volume pack totals matching Revolut links", async () => {
    const product = await prisma.product.create({
      data: {
        slug: "mini-airtag-finder",
        name: "Mini AirTag Finder",
        shortDescription: "Tracker",
        description: "Tracker",
        status: "PUBLISHED",
        type: "PHYSICAL",
        priceCents: 699,
        stock: 25,
      },
    });

    const one = await validateCheckoutLines([
      { productId: product.id, quantity: 1 },
    ]);
    expect(one[0]?.unitPriceCents).toBe(699);
    expect(one[0]?.lineTotalCents).toBe(699);

    const two = await validateCheckoutLines([
      { productId: product.id, quantity: 2 },
    ]);
    expect(two[0]?.unitPriceCents).toBe(600);
    expect(two[0]?.lineTotalCents).toBe(1199);

    const four = await validateCheckoutLines([
      { productId: product.id, quantity: 4 },
    ]);
    expect(four[0]?.unitPriceCents).toBe(500);
    expect(four[0]?.lineTotalCents).toBe(1999);
  });
});
