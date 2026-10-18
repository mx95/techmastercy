import { notFound, permanentRedirect } from "next/navigation";
import { AddToCartForm } from "@/components/shop/AddToCartForm";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import { getExternalShopProduct } from "@/content/external-shop";
import { getProductVolumeBundles } from "@/content/product-bundles";
import { getPublishedProduct, getRelatedProducts } from "@/lib/products";
import { formatEur } from "@/lib/money";
import {
  breadcrumbJsonLd,
  createMetadata,
  productJsonLd,
} from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const external = getExternalShopProduct(slug);
  if (external) {
    return createMetadata({
      title: external.name,
      description: external.shortDescription,
      path: `/shop/${external.slug}`,
      ogImage: external.images[0],
    });
  }
  const product = await getPublishedProduct(slug);
  if (!product) {
    return createMetadata({
      title: "Product not found",
      description: "This product is unavailable.",
      path: `/shop/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    path: `/shop/${product.slug}`,
    ogImage: product.images[0],
  });
}

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const external = getExternalShopProduct(slug);
  if (external?.externalUrl) {
    permanentRedirect(external.externalUrl);
  }
  const product = await getPublishedProduct(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.slug, 4);
  const volumeBundles = getProductVolumeBundles(product.slug);
  const singlePack = volumeBundles?.packs.find((pack) => pack.quantity === 1);
  const offerPriceCents =
    singlePack?.packTotalCents ??
    singlePack?.unitPriceCents ??
    product.priceCents;

  const availability =
    product.type === "PHYSICAL" && product.stock !== null && product.stock <= 0
      ? "OutOfStock"
      : "InStock";

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.name, path: `/shop/${product.slug}` },
        ]}
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} alt={product.name} />
        <div>
          {product.category ? (
            <p className="text-xs uppercase tracking-[0.16em] text-foreground-muted">
              {product.category.name}
            </p>
          ) : null}
          <h1 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-foreground-muted">{product.shortDescription}</p>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold text-accent-soft">
              {formatEur(offerPriceCents)}
            </span>
            {product.compareAtCents && product.compareAtCents > offerPriceCents ? (
              <span className="text-foreground-muted line-through">
                {formatEur(product.compareAtCents)}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-foreground-muted">
            {volumeBundles?.packs.some((pack) => pack.quantity > 1)
              ? `Single ${formatEur(offerPriceCents)}. Packs: ${volumeBundles.packs
                  .filter((pack) => pack.quantity > 1)
                  .map(
                    (pack) =>
                      `${pack.quantity} for ${formatEur(
                        pack.packTotalCents ?? pack.unitPriceCents * pack.quantity,
                      )}`,
                  )
                  .join(" · ")}.`
              : "Prices in EUR. Final totals are calculated and validated on the server at checkout."}
          </p>

          <div className="mt-8">
            <AddToCartForm
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                type: product.type,
                priceCents: offerPriceCents,
                images: product.images,
              }}
              licences={product.licences}
              stock={product.stock}
              volumeBundles={volumeBundles}
            />
          </div>

          {product.features.length ? (
            <ul className="mt-8 space-y-2">
              {product.features.map((feature) => (
                <li key={feature} className="text-sm text-foreground-muted">
                  <span className="mr-2 text-accent">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <section className="prose-invert mt-12 max-w-3xl whitespace-pre-wrap text-sm leading-relaxed text-foreground-muted">
        <h2 className="font-display text-xl font-semibold text-white">Details</h2>
        <p className="mt-4">{product.description}</p>
      </section>

      {related.length ? (
        <section className="mt-14">
          <h2 className="font-display text-xl font-semibold text-white">
            You may also like
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Other published items from the TechmasterCY catalogue.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <div className="surface rounded-lg p-4 text-sm text-foreground-muted">
          <p className="font-medium text-white">Refunds</p>
          <p className="mt-1">
            See the{" "}
            <a href="/refunds" className="text-accent-soft hover:underline">
              refund policy
            </a>{" "}
            draft before purchase.
          </p>
        </div>
        <div className="surface rounded-lg p-4 text-sm text-foreground-muted">
          <p className="font-medium text-white">Digital delivery</p>
          <p className="mt-1">
            Digital products (when published) use expiring download links after payment verification.
          </p>
        </div>
        <div className="surface rounded-lg p-4 text-sm text-foreground-muted">
          <p className="font-medium text-white">Licences</p>
          <p className="mt-1">
            Licence terms for digital goods are summarised on the{" "}
            <a href="/licence" className="text-accent-soft hover:underline">
              licence page
            </a>
            .
          </p>
        </div>
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/shop/${product.slug}` },
          ]),
          productJsonLd({
            name: product.name,
            description: product.shortDescription,
            path: `/shop/${product.slug}`,
            priceCents: offerPriceCents,
            images: product.images,
            availability,
          }),
        ]}
      />
    </Container>
  );
}
