import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  priceCents: number;
  compareAtCents: number | null;
  type: "DIGITAL" | "PHYSICAL";
  images: string[];
  categorySlug: string | null;
  categoryName: string | null;
  previewNote: string | null;
  features: string[];
  stock: number | null;
};

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

export function mapProductCard(
  product: Prisma.ProductGetPayload<{ include: { category: true; licences: true } }>,
): ProductCardData {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortDescription: product.shortDescription,
    priceCents: product.priceCents,
    compareAtCents: product.compareAtCents,
    type: product.type,
    images: parseJsonArray(product.images),
    categorySlug: product.category?.slug ?? null,
    categoryName: product.category?.name ?? null,
    previewNote: product.previewNote,
    features: parseJsonArray(product.features),
    stock: product.stock,
  };
}

export async function listPublishedProducts(options?: {
  q?: string;
  category?: string;
  type?: "DIGITAL" | "PHYSICAL";
  sort?: "relevance" | "price-asc" | "price-desc" | "newest";
}) {
  const where: Prisma.ProductWhereInput = {
    status: "PUBLISHED",
  };

  if (options?.category) {
    where.category = { slug: options.category };
  }
  if (options?.type) {
    where.type = options.type;
  }
  if (options?.q) {
    const q = options.q.trim();
    where.OR = [
      { name: { contains: q } },
      { shortDescription: { contains: q } },
      { description: { contains: q } },
    ];
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { sortOrder: "asc" };
  if (options?.sort === "price-asc") orderBy = { priceCents: "asc" };
  if (options?.sort === "price-desc") orderBy = { priceCents: "desc" };
  if (options?.sort === "newest") orderBy = { createdAt: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: { category: true, licences: { where: { active: true }, orderBy: { sortOrder: "asc" } } },
    orderBy,
  });

  return products.map(mapProductCard);
}

export async function getPublishedProduct(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: {
      category: true,
      licences: { where: { active: true }, orderBy: { sortOrder: "asc" } },
    },
  });
  if (!product) return null;
  return {
    ...product,
    images: parseJsonArray(product.images),
    features: parseJsonArray(product.features),
  };
}

export async function listCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { products: { where: { status: "PUBLISHED" } } },
      },
    },
  });
}
