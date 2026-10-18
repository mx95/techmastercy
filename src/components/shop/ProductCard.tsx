import Image from "next/image";
import Link from "next/link";
import { getProductVolumeBundles } from "@/content/product-bundles";
import type { ProductCardData } from "@/lib/products";
import { formatEur } from "@/lib/money";

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0] || "/images/brand/logo-wordmark-on-light.png";
  const outOfStock = product.type === "PHYSICAL" && product.stock !== null && product.stock <= 0;
  const volumeBundles = getProductVolumeBundles(product.slug);
  const singlePack = volumeBundles?.packs.find((pack) => pack.quantity === 1);
  const displayPriceCents =
    singlePack?.packTotalCents ?? singlePack?.unitPriceCents ?? product.priceCents;
  const href = product.externalUrl || `/shop/${product.slug}`;
  const isExternal = Boolean(product.externalUrl);
  const linkProps = isExternal
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <article className="surface group flex h-full min-w-0 flex-col overflow-hidden rounded-lg transition hover:border-accent/40">
      <Link
        href={href}
        className="relative block aspect-[4/3] bg-background-soft"
        {...linkProps}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover bg-[#f4f7fb] transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          quality={85}
        />
        {isExternal ? (
          <span className="absolute left-3 top-3 rounded bg-background/90 px-2 py-0.5 text-xs font-semibold text-accent-soft">
            PetPal
          </span>
        ) : null}
        {!isExternal &&
        product.compareAtCents &&
        product.compareAtCents > product.priceCents ? (
          <span className="absolute left-3 top-3 rounded bg-accent px-2 py-0.5 text-xs font-semibold text-background">
            Sale
          </span>
        ) : null}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col p-4">
        {product.categoryName ? (
          <p className="text-xs uppercase tracking-[0.14em] text-foreground-muted">
            {product.categoryName}
          </p>
        ) : null}
        <h3 className="mt-1 font-display text-base font-semibold leading-snug">
          <Link href={href} className="break-words hover:text-accent-soft" {...linkProps}>
            {product.name}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-foreground-muted">
          {product.shortDescription}
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <span className="text-lg font-semibold text-accent-soft">
            {formatEur(displayPriceCents)}
          </span>
          {product.compareAtCents && product.compareAtCents > displayPriceCents ? (
            <span className="text-sm text-foreground-muted line-through">
              {formatEur(product.compareAtCents)}
            </span>
          ) : null}
        </div>
        {isExternal ? (
          <p className="mt-2 text-xs text-foreground-muted">
            {product.externalCta || "Buy on partner site"} →
          </p>
        ) : null}
        {outOfStock ? (
          <p className="mt-2 text-xs text-danger">Sold out</p>
        ) : null}
      </div>
    </article>
  );
}
