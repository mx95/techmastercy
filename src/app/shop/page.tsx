import { Suspense } from "react";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFilters } from "@/components/shop/ProductFilters";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { JsonLd } from "@/components/site/JsonLd";
import { listCategories, listPublishedProducts } from "@/lib/products";
import { breadcrumbJsonLd, createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Shop",
  description:
    "Buy car tech, smart finders and upcoming developer tools from TechmasterCY. EUR pricing with server-validated checkout.",
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

  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Shop", path: "/shop" }]} />
      <SectionHeading
        className="mt-6"
        eyebrow="Shop"
        title="Technology products with clear checkout"
        description="Browse published catalogue items. Prices are re-validated on the server before payment. Digital kits appear here only after files are ready."
      />
      <div className="mt-8">
        <Suspense fallback={<div className="surface h-28 animate-pulse rounded-lg" />}>
          <ProductFilters
            categories={categories.map((c) => ({
              slug: c.slug,
              name: c.name,
              count: c._count.products,
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
