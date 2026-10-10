import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { siteConfig } from "@/lib/config";
import { prisma } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");

  const staticRoutes = [
    "",
    "/services",
    "/services/ai-automation",
    "/shop",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
    "/refunds",
    "/licence",
    "/articles",
  ].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority:
      path === "" ? 1 : path === "/services/ai-automation" || path === "/services" ? 0.9 : 0.7,
  }));

  const serviceRoutes = services.map((service) => ({
    url: `${base}/services/${service.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const productRoutes = products.map((product) => ({
    url: `${base}/shop/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const { articles } = await import("@/content/articles");
  const articleRoutes = articles.map((article) => ({
    url: `${base}/articles/${article.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...productRoutes, ...articleRoutes];
}
