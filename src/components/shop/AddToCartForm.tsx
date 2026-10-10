"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/site/Button";
import { formatEur } from "@/lib/money";

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
}) {
  const { addItem } = useCart();
  const [licenceId, setLicenceId] = useState(licences[0]?.id || "");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const selectedLicence = useMemo(
    () => licences.find((l) => l.id === licenceId) || null,
    [licenceId, licences],
  );

  const unitPrice = selectedLicence?.priceCents ?? product.priceCents;
  const soldOut = product.type === "PHYSICAL" && stock !== null && stock <= 0;

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
    setMessage("Added to cart.");
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

      {product.type === "PHYSICAL" ? (
        <div>
          <label htmlFor="qty" className="text-sm font-medium">
            Quantity
          </label>
          <input
            id="qty"
            type="number"
            min={1}
            max={stock && stock > 0 ? Math.min(99, stock) : 99}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="mt-1 w-24 rounded-md border border-white/15 bg-background px-3 py-2"
          />
          {stock !== null ? (
            <p className="mt-1 text-xs text-foreground-muted">
              {stock > 0 ? `${stock} in stock` : "Sold out"}
            </p>
          ) : null}
        </div>
      ) : null}

      <p className="text-2xl font-semibold text-accent-soft">{formatEur(unitPrice)}</p>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={soldOut}>
        {soldOut ? "Sold out" : "Add to cart"}
      </Button>
      {message ? <p className="text-sm text-foreground-muted" role="status">{message}</p> : null}
    </form>
  );
}
