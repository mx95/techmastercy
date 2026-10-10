export function formatEur(cents: number): string {
  return new Intl.NumberFormat("en-CY", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function calculateTaxPortion(
  totalCents: number,
  rateBps: number,
  inclusive: boolean,
): { subtotalCents: number; taxCents: number; totalCents: number } {
  if (rateBps <= 0) {
    return { subtotalCents: totalCents, taxCents: 0, totalCents };
  }
  if (inclusive) {
    const taxCents = Math.round((totalCents * rateBps) / (10000 + rateBps));
    return {
      subtotalCents: totalCents - taxCents,
      taxCents,
      totalCents,
    };
  }
  const taxCents = Math.round((totalCents * rateBps) / 10000);
  return {
    subtotalCents: totalCents,
    taxCents,
    totalCents: totalCents + taxCents,
  };
}

export function sumLineTotals(
  lines: Array<{ unitPriceCents: number; quantity: number }>,
): number {
  return lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
}
