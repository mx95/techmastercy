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
 */
export function buildSitemapEntries(options?: {
  productSlugs?: string[];
}): SitemapEntry[] {
  const entries: SitemapEntry[] = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/shop", changeFrequency: "daily", priority: 0.9 },
    { path: "/services", changeFrequency: "weekly", priority: 0.9 },
    { path: "/services/ai-automation", changeFrequency: "weekly", priority: 0.9 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/faq", changeFrequency: "monthly", priority: 0.6 },
    { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const service of services) {
    entries.push({
      path: `/services/${service.slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  for (const slug of options?.productSlugs ?? []) {
    entries.push({
      path: `/shop/${slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }

  return entries.filter((entry) => !isExcludedFromSitemap(entry.path));
}

export function isExcludedFromSitemap(path: string): boolean {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return SITEMAP_EXCLUDED_PREFIXES.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}
