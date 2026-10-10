import { describe, expect, it } from "vitest";
import { calculateTaxPortion, formatEur, sumLineTotals } from "@/lib/money";

describe("formatEur", () => {
  it("formats euro cents", () => {
    expect(formatEur(8999)).toContain("89");
    expect(formatEur(0)).toContain("0");
  });
});

describe("calculateTaxPortion", () => {
  it("splits inclusive VAT (19%)", () => {
    const result = calculateTaxPortion(11900, 1900, true);
    expect(result.totalCents).toBe(11900);
    expect(result.taxCents).toBe(1900);
    expect(result.subtotalCents).toBe(10000);
  });

  it("adds exclusive VAT (19%)", () => {
    const result = calculateTaxPortion(10000, 1900, false);
    expect(result.subtotalCents).toBe(10000);
    expect(result.taxCents).toBe(1900);
    expect(result.totalCents).toBe(11900);
  });

  it("handles zero rate", () => {
    expect(calculateTaxPortion(5000, 0, true)).toEqual({
      subtotalCents: 5000,
      taxCents: 0,
      totalCents: 5000,
    });
  });
});

describe("sumLineTotals", () => {
  it("sums unit × quantity", () => {
    expect(
      sumLineTotals([
        { unitPriceCents: 499, quantity: 2 },
        { unitPriceCents: 1000, quantity: 1 },
      ]),
    ).toBe(1998);
  });
});
