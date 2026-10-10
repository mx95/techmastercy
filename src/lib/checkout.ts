import { prisma } from "@/lib/db";
import { calculateTaxPortion, sumLineTotals } from "@/lib/money";
import { getTaxConfig } from "@/lib/config";
import type { CheckoutLineInput, ValidatedCheckoutLine } from "@/lib/payments/types";

export class CheckoutValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CheckoutValidationError";
  }
}

export async function validateCheckoutLines(
  lines: CheckoutLineInput[],
): Promise<ValidatedCheckoutLine[]> {
  if (!lines.length) {
    throw new CheckoutValidationError("Cart is empty.");
  }

  const validated: ValidatedCheckoutLine[] = [];

  for (const line of lines) {
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) {
      throw new CheckoutValidationError("Invalid quantity.");
    }

    const product = await prisma.product.findUnique({
      where: { id: line.productId },
      include: { licences: true },
    });

    if (!product || product.status !== "PUBLISHED") {
      throw new CheckoutValidationError("One or more products are unavailable.");
    }

    if (product.type === "PHYSICAL" && product.stock !== null && product.stock < line.quantity) {
      throw new CheckoutValidationError(`${product.name} does not have enough stock.`);
    }

    let unitPriceCents = product.priceCents;
    let licenceOptionId: string | null = null;
    let licenceName: string | null = null;

    if (line.licenceOptionId) {
      const licence = product.licences.find(
        (l) => l.id === line.licenceOptionId && l.active,
      );
      if (!licence) {
        throw new CheckoutValidationError("Invalid licence option selected.");
      }
      unitPriceCents = licence.priceCents;
      licenceOptionId = licence.id;
      licenceName = licence.name;
    } else if (product.type === "DIGITAL" && product.licences.some((l) => l.active)) {
      throw new CheckoutValidationError("A licence option is required for this product.");
    }

    validated.push({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      productType: product.type,
      licenceOptionId,
      licenceName,
      unitPriceCents,
      quantity: line.quantity,
      lineTotalCents: unitPriceCents * line.quantity,
    });
  }

  return validated;
}

export function calculateOrderTotals(lines: ValidatedCheckoutLine[]) {
  const goodsCents = sumLineTotals(lines);
  const tax = getTaxConfig();
  const breakdown = calculateTaxPortion(goodsCents, tax.rateBps, tax.inclusive);
  return {
    ...breakdown,
    shippingCents: 0,
    taxInclusive: tax.inclusive,
  };
}
