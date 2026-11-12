import { getPublishedArticles } from "@/content/articles";
import { seoLanders } from "@/content/seo-landers";
import { servicePillars } from "@/content/service-pillars";
import { services } from "@/content/services";

/** Paths that must never appear in the public sitemap. */
export const SITEMAP_EXCLUDED_PREFIXES = [
  "/admin",
  "/cart",
  "/checkout",
  "/api",
  "/order",
] as const;

export type SitemapEntry = {
  path: string;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
};

/**
 * Public URL paths eligible for sitemap inclusion.
 * Keep this list aligned with real public routes as they ship.
 * Do not include outbound 308 shop aliases (e.g. PetPal).
 * Draft articles are excluded via getPublishedArticles().
 */
export function buildSitemapEntries(options?: {
  productSlugs?: string[];
}): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/services", changeFrequency: "weekly", priority: 0.95 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.85 },
    { path: "/articles", changeFrequency: "weekly", priority: 0.75 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.55 },
    // Hardware shop de-emphasised for services-led organic strategy.
    { path: "/shop", changeFrequency: "weekly", priority: 0.4 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/refunds", changeFrequency: "yearly", priority: 0.3 },
    { path: "/licence", changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const lander of seoLanders) {
    entries.push({
      path: lander.path,
      changeFrequency: "weekly",
      priority: 0.92,
    });
  }

  for (const pillar of servicePillars) {
    entries.push({
      path: `/services/${pillar.slug}`,
      changeFrequency: "weekly",
      priority: pillar.featured ? 0.95 : 0.88,
    });
  }

  for (const service of services) {
    entries.push({
      path: `/services/${service.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const article of getPublishedArticles()) {
    entries.push({
      path: `/articles/${article.slug}`,
      changeFrequency: "monthly",
      priority: 0.65,
    });
  }

  for (const slug of options?.productSlugs ?? []) {
    entries.push({
      path: `/shop/${slug}`,
      changeFrequency: "weekly",
      priority: 0.35,
    });
  }

  // Deduplicate (e.g. services listed both statically and from content).
  const seen = new Set<string>();
  return entries.filter((entry) => {
    if (isExcludedFromSitemap(entry.path)) return false;
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });
}

export function isExcludedFromSitemap(path: string): boolean {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return SITEMAP_EXCLUDED_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}
