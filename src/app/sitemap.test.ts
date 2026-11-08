import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/db", () => ({
  prisma: {
    product: {
      findMany: vi.fn(async () => [
        { slug: "mini-airtag-finder", updatedAt: new Date("2026-01-01") },
        { slug: "ottocast-cabin-care", updatedAt: new Date("2026-02-01") },
      ]),
    },
  },
}));

describe("sitemap route", () => {
  it("includes public routes, published products, and excludes private ones", async () => {
    const sitemap = (await import("@/app/sitemap")).default;
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);

    expect(urls.some((u) => u.endsWith("techmaster.com.cy/"))).toBe(true);
    expect(urls.some((u) => u.includes("/shop/mini-airtag-finder"))).toBe(true);
    expect(urls.some((u) => u.includes("/shop/ottocast-cabin-care"))).toBe(true);
    expect(urls.some((u) => u.includes("/services/jcc-payment-integration"))).toBe(
      true,
    );
    expect(urls.some((u) => u.includes("/articles/"))).toBe(true);
    expect(urls.some((u) => u.includes("/admin"))).toBe(false);
    expect(urls.some((u) => u.includes("/cart"))).toBe(false);
    expect(urls.some((u) => u.includes("/checkout"))).toBe(false);
    expect(urls.some((u) => u.includes("/order/"))).toBe(false);
    expect(urls.some((u) => u.includes("petpal"))).toBe(false);
  });
});
