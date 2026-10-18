import { describe, expect, it } from "vitest";
import {
  buildSitemapEntries,
  isExcludedFromSitemap,
  SITEMAP_EXCLUDED_PREFIXES,
} from "@/lib/sitemap-entries";

describe("sitemap exclusions", () => {
  it("excludes admin, cart, and checkout prefixes", () => {
    expect(SITEMAP_EXCLUDED_PREFIXES).toEqual(
      expect.arrayContaining(["/admin", "/cart", "/checkout"]),
    );
    expect(isExcludedFromSitemap("/admin")).toBe(true);
    expect(isExcludedFromSitemap("/admin/products")).toBe(true);
    expect(isExcludedFromSitemap("/cart")).toBe(true);
    expect(isExcludedFromSitemap("/checkout")).toBe(true);
    expect(isExcludedFromSitemap("/shop")).toBe(false);
  });

  it("never emits admin/cart/checkout paths", () => {
    const paths = buildSitemapEntries({
      productSlugs: ["mini-airtag-finder"],
    }).map((e) => e.path);

    expect(paths.some((p) => p === "/admin" || p.startsWith("/admin/"))).toBe(
      false,
    );
    expect(paths.some((p) => p === "/cart" || p.startsWith("/cart/"))).toBe(
      false,
    );
    expect(
      paths.some((p) => p === "/checkout" || p.startsWith("/checkout/")),
    ).toBe(false);
    expect(paths).toContain("/");
    expect(paths).toContain("/shop/mini-airtag-finder");
    expect(paths).toContain("/services/ai-automation");
    expect(paths).toContain("/services/ai-consulting-implementation");
    expect(paths).toContain("/services/technical-support");
    expect(paths).toContain("/services/smarthome-consulting-integration");
  });
});
