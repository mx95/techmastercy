import { Suspense } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/site/JsonLd";
import { listExternalShopProducts } from "@/content/external-shop";
import { listCategories, listPublishedProducts } from "@/lib/products";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shop",
  description:
    "Shop AirTag finders and car tech on TechmasterCY. PetPal GPS pet trackers open petpal.com.cy for checkout.",
  path: "/shop",
});

type SearchParams = Promise<{
  q?: string;
  category?: string;
  type?: string;
  sort?: string;
}>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const type =
    params.type === "DIGITAL" || params.type === "PHYSICAL" ? params.type : undefined;
  const sort =
    params.sort === "price-asc" ||
    params.sort === "price-desc" ||
    params.sort === "newest" ||
    params.sort === "relevance"
      ? params.sort
      : "relevance";

  const [products, categories] = await Promise.all([
    listPublishedProducts({
      q: params.q,
      category: params.category,
      type,
      sort,
    }),
    listCategories(),
  ]);

  const externalByCategory = listExternalShopProducts().reduce<Record<string, number>>(
    (acc, product) => {
      if (!product.categorySlug) return acc;
      acc[product.categorySlug] = (acc[product.categorySlug] ?? 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <SectionHeading
        className="mt-6"
        eyebrow="Shop"
        title="Tech you can buy today"
        description="Local checkout is validated on the server. PetPal GPS trackers send you to petpal.com.cy—same builder, separate shop."
      />
      <div className="mt-8">
        <Suspense fallback={<div className="surface h-28 animate-pulse rounded-lg" />}>
          <ProductFilters
            categories={categories.map((c) => ({
              slug: c.slug,
              name: c.name,
              count: c._count.products + (externalByCategory[c.slug] ?? 0),
            }))}
          />
        </Suspense>
      </div>
      {products.length === 0 ? (
        <div className="surface mt-10 rounded-lg px-6 py-16 text-center">
          <p className="font-display text-xl font-semibold">No products match</p>
          <p className="mt-2 text-foreground-muted">
            Try clearing filters or searching with a different term.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ])}
      />
    </Container>
  );
}
