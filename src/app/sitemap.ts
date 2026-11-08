import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { prisma } from "@/lib/db";
import { buildSitemapEntries } from "@/lib/sitemap-entries";

/** Always rebuild from the live catalogue so Google Search Console stays current. */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  let products: Array<{ slug: string; updatedAt: Date }> = [];
  try {
    products = await prisma.product.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true, updatedAt: true },
    });
  } catch {
    products = [];
  }

  const productLastMod = new Map(
    products.map((product) => [product.slug, product.updatedAt]),
  );

  const entries = buildSitemapEntries({
    productSlugs: products.map((product) => product.slug),
  });

  const now = new Date();

  return entries.map((entry) => {
    const slug = entry.path.startsWith("/shop/")
      ? entry.path.slice("/shop/".length)
      : null;

    return {
      url: entry.path === "/" ? `${base}/` : `${base}${entry.path}`,
      lastModified: (slug && productLastMod.get(slug)) || now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
    };
  });
}
