import { describe, expect, it } from "vitest";
import {
  packDisplayTotal,
  resolveVolumeLineTotal,
  resolveVolumeUnitPrice,
  getProductVolumeBundles,
} from "@/content/product-bundles";

describe("resolveVolumeUnitPrice", () => {
  it("returns pack rates for mini airtag quantities", () => {
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 1, 699)).toBe(699);
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 2, 699)).toBe(600);
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 4, 699)).toBe(500);
  });

  it("uses tier thresholds for in-between quantities", () => {
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 3, 699)).toBe(600);
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 5, 699)).toBe(500);
  });

  it("falls back for products without packs", () => {
    expect(resolveVolumeUnitPrice("ottocast-cabin-care", 2, 8999)).toBe(8999);
  });
});

describe("resolveVolumeLineTotal", () => {
  it("matches Revolut payment-link pack totals", () => {
    expect(resolveVolumeLineTotal("mini-airtag-finder", 1, 699)).toBe(699);
    expect(resolveVolumeLineTotal("mini-airtag-finder", 2, 699)).toBe(1199);
    expect(resolveVolumeLineTotal("mini-airtag-finder", 4, 699)).toBe(1999);
  });
});

describe("packDisplayTotal", () => {
  it("prefers exact pack totals over unit × qty", () => {
    const packs = getProductVolumeBundles("mini-airtag-finder")!.packs;
    expect(packDisplayTotal(packs[0]!)).toBe(699);
    expect(packDisplayTotal(packs[1]!)).toBe(1199);
    expect(packDisplayTotal(packs[2]!)).toBe(1999);
    // Unit × qty would be 1200 / 2000 — pack totals must win for Revolut.
    expect(packs[1]!.unitPriceCents * packs[1]!.quantity).toBe(1200);
    expect(packs[2]!.unitPriceCents * packs[2]!.quantity).toBe(2000);
  });
});
