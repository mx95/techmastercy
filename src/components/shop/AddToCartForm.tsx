"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/site/Button";
import {
  packDisplayTotal,
  resolveVolumeLineTotal,
  resolveVolumeUnitPrice,
  type ProductBundleConfig,
  type ProductVolumePack,
} from "@/content/product-bundles";
import { formatEur } from "@/lib/money";

function packOptionSubtitle(pack: ProductVolumePack): string {
  const total = packDisplayTotal(pack);
  if (pack.quantity === 1) {
    return `${formatEur(total)} each`;
  }
  const unitTimesQty = pack.unitPriceCents * pack.quantity;
  if (pack.packTotalCents != null && pack.packTotalCents !== unitTimesQty) {
    return `${pack.quantity} for ${formatEur(total)}`;
  }
  return `${pack.quantity} × ${formatEur(pack.unitPriceCents)}`;
}

type Licence = {
  id: string;
  name: string;
  description: string | null;
  priceCents: number;
};

export function AddToCartForm({
  product,
  licences,
  stock,
  volumeBundles = null,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    type: "DIGITAL" | "PHYSICAL";
    priceCents: number;
    images: string[];
  };
  licences: Licence[];
  stock: number | null;
  volumeBundles?: ProductBundleConfig | null;
}) {
  const { addItem } = useCart();
  const [licenceId, setLicenceId] = useState(licences[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const selectedLicence = useMemo(
    () => licences.find((l) => l.id === licenceId) || null,
    [licenceId, licences],
  );

  const unitPrice = useMemo(() => {
    if (selectedLicence) return selectedLicence.priceCents;
    return resolveVolumeUnitPrice(product.slug, quantity, product.priceCents);
  }, [product.priceCents, product.slug, quantity, selectedLicence]);

  const lineTotal = useMemo(() => {
    if (selectedLicence) return selectedLicence.priceCents * quantity;
    return resolveVolumeLineTotal(product.slug, quantity, product.priceCents);
  }, [product.priceCents, product.slug, quantity, selectedLicence]);

  const soldOut = product.type === "PHYSICAL" && stock !== null && stock <= 0;
  const maxQty =
    product.type === "PHYSICAL" && stock !== null && stock > 0
      ? Math.min(99, stock)
      : 99;

  const availablePacks = useMemo(() => {
    if (!volumeBundles?.packs?.length) return [];
    return volumeBundles.packs.filter((pack) => pack.quantity <= maxQty);
  }, [maxQty, volumeBundles]);

  const activePackQty = availablePacks.some((pack) => pack.quantity === quantity)
    ? quantity
    : null;

  function setQty(next: number) {
    const clamped = Math.max(1, Math.min(maxQty, Number.isFinite(next) ? next : 1));
    setQuantity(clamped);
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (soldOut) {
      setMessage("This product is currently sold out.");
      return;
    }
    if (product.type === "DIGITAL" && licences.length > 0 && !selectedLicence) {
      setMessage("Select a licence option.");
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] || "/images/brand/logo-wordmark-on-light.png",
      unitPriceCents: unitPrice,
      licenceOptionId: selectedLicence?.id,
      licenceName: selectedLicence?.name,
      quantity,
      type: product.type,
    });
    setMessage(
      quantity > 1 ? `Added ${quantity} to cart.` : "Added to cart.",
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {licences.length > 0 ? (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Licence</legend>
          {licences.map((licence) => (
            <label
              key={licence.id}
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3 ${
                licenceId === licence.id ? "border-accent bg-accent-dim" : "border-white/10"
              }`}
            >
              <input
                type="radio"
                name="licence"
                value={licence.id}
                checked={licenceId === licence.id}
                onChange={() => setLicenceId(licence.id)}
                className="mt-1"
              />
              <span>
                <span className="block font-medium">{licence.name}</span>
                {licence.description ? (
                  <span className="block text-sm text-foreground-muted">
                    {licence.description}
                  </span>
                ) : null}
                <span className="mt-1 block text-sm text-accent-soft">
                  {formatEur(licence.priceCents)}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
      ) : null}

      {product.type === "PHYSICAL" && !soldOut && availablePacks.length > 0 ? (
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium tracking-wide text-foreground">
            {volumeBundles?.heading ?? "Buy in bulk"}
          </legend>
          <div className="grid gap-2">
            {availablePacks.map((pack) => {
              const selected = activePackQty === pack.quantity;
              const packTotal = packDisplayTotal(pack);
              return (
                <label
                  key={pack.quantity}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-3 transition ${
                    selected
                      ? "border-accent bg-accent-dim"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <input
                      type="radio"
                      name="volume-pack"
                      value={pack.quantity}
                      checked={selected}
                      onChange={() => setQty(pack.quantity)}
                      className="mt-0.5"
                    />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-white">{pack.label}</span>
                        {pack.badge ? (
                          <span className="rounded bg-accent/20 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent-soft">
                            {pack.badge}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-xs text-foreground-muted">
                        {packOptionSubtitle(pack)}
                      </span>
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-accent-soft">
                    {formatEur(packTotal)}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {product.type === "PHYSICAL" && !soldOut ? (
        <div>
          <label htmlFor="qty" className="text-sm font-medium">
            Quantity
          </label>
          <div className="mt-2 inline-flex items-stretch overflow-hidden rounded-md border border-white/15 bg-background">
            <button
              type="button"
              onClick={() => setQty(quantity - 1)}
              disabled={quantity <= 1}
              className="flex h-11 w-11 items-center justify-center text-lg text-foreground transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              id="qty"
              type="number"
              inputMode="numeric"
              min={1}
              max={maxQty}
              value={quantity}
              onChange={(e) => setQty(Number(e.target.value))}
              className="h-11 w-16 border-x border-white/15 bg-transparent text-center text-base tabular-nums outline-none sm:text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setQty(quantity + 1)}
              disabled={quantity >= maxQty}
              className="flex h-11 w-11 items-center justify-center text-lg text-foreground transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          {stock !== null ? (
            <p className="mt-2 text-xs text-foreground-muted">{stock} in stock</p>
          ) : null}
          <p className="mt-1 text-xs text-foreground-muted">
            {quantity === 1
              ? `${formatEur(lineTotal)} each`
              : `Line total ${formatEur(lineTotal)}`}
          </p>
        </div>
      ) : null}

      {soldOut ? (
        <p
          className="inline-flex rounded-md border border-danger/30 bg-danger/10 px-3 py-2 text-sm font-medium text-danger"
          role="status"
        >
          Sold out
        </p>
      ) : null}

      {licences.length > 0 ? (
        <p className="text-xl font-semibold text-accent-soft">{formatEur(unitPrice)}</p>
      ) : null}

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={soldOut}>
        {soldOut ? "Sold out" : "Add to cart"}
      </Button>
      {message ? (
        <p className="text-sm text-foreground-muted" role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
