import { describe, expect, it } from "vitest";
import { absoluteUrl, faqJsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

describe("seo helpers", () => {
  it("builds absolute URLs", () => {
    expect(absoluteUrl("/contact")).toMatch(/\/contact$/);
    expect(absoluteUrl("/")).toBeTruthy();
  });

  it("includes verified social profiles on the organization schema", () => {
    const org = organizationJsonLd() as Record<string, unknown>;
    expect(org["@type"]).toBe("Organization");
    expect(String(org.logo)).toMatch(/emblem-black-on-white\.png$/);
    expect(Array.isArray(org.sameAs)).toBe(true);
    expect(org.sameAs as string[]).toContain("https://www.instagram.com/techmastercy/");
  });

  it("builds FAQPage structured data", () => {
    const faq = faqJsonLd([{ q: "Currency?", a: "Euro (EUR)." }]);
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity).toHaveLength(1);
    expect(faq.mainEntity[0]?.["@type"]).toBe("Question");
  });

  it("builds WebSite structured data", () => {
    const site = websiteJsonLd();
    expect(site["@type"]).toBe("WebSite");
    expect(site.name).toBe("TechmasterCY");
  });
});
