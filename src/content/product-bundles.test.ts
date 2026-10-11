import { describe, expect, it } from "vitest";
import { resolveVolumeUnitPrice } from "@/content/product-bundles";

describe("resolveVolumeUnitPrice", () => {
  it("returns pack rates for mini airtag quantities", () => {
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 1, 799)).toBe(799);
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 2, 799)).toBe(599);
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 4, 799)).toBe(499);
  });

  it("uses tier thresholds for in-between quantities", () => {
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 3, 799)).toBe(599);
    expect(resolveVolumeUnitPrice("mini-airtag-finder", 5, 799)).toBe(499);
  });

  it("falls back for products without packs", () => {
    expect(resolveVolumeUnitPrice("ottocast-cabin-care", 2, 8999)).toBe(8999);
  });
});
