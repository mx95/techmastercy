import { describe, expect, it } from "vitest";
import {
  resolveVolumeLineTotal,
  resolveVolumeUnitPrice,
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
