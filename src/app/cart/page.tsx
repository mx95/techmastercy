"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { resolveVolumeLineTotal } from "@/content/product-bundles";
import { formatEur } from "@/lib/money";

export default function CartPage() {
  const { lines, ready, subtotalCents, updateQuantity, removeItem } = useCart();

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <h1 className="font-display text-3xl font-semibold">Cart</h1>
      <p className="mt-2 text-sm text-foreground-muted">
        Cart contents are stored in your browser and re-priced on the server at checkout.
      </p>

      {!ready ? (
        <p className="mt-8 text-foreground-muted">Loading…</p>
      ) : lines.length === 0 ? (
        <div className="surface mt-8 rounded-lg px-6 py-16 text-center">
          <p className="font-display text-xl font-semibold">Your cart is empty</p>
          <Button href="/shop" className="mt-4">
            Explore the shop
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <ul className="space-y-4">
            {lines.map((line) => (
              <li
                key={`${line.productId}-${line.licenceOptionId || "base"}`}
                className="surface flex gap-4 rounded-lg p-4"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-background-soft">
                  <Image src={line.image} alt="" fill className="object-cover" sizes="80px" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/shop/${line.slug}`} className="font-medium hover:text-accent-soft">
                    {line.name}
                  </Link>
                  {line.licenceName ? (
                    <p className="text-sm text-foreground-muted">{line.licenceName}</p>
                  ) : null}
                  <p className="mt-1 text-accent-soft">{formatEur(line.unitPriceCents)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="sr-only" htmlFor={`cart-qty-${line.productId}`}>
                      Quantity
                    </label>
                    <input
                      id={`cart-qty-${line.productId}`}
                      type="number"
                      min={1}
                      max={99}
                      value={line.quantity}
                      onChange={(e) =>
                        updateQuantity(
                          line.productId,
                          Number(e.target.value),
                          line.licenceOptionId,
                        )
                      }
                      className="w-20 rounded-md border border-white/15 bg-background px-2 py-1"
                    />
                    <button
                      type="button"
                      className="text-sm text-danger hover:underline"
                      onClick={() => removeItem(line.productId, line.licenceOptionId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="font-semibold">
                  {formatEur(
                    line.licenceOptionId
                      ? line.unitPriceCents * line.quantity
                      : resolveVolumeLineTotal(
                          line.slug,
                          line.quantity,
                          line.unitPriceCents,
                        ),
                  )}
                </p>
              </li>
            ))}
          </ul>
          <aside className="surface h-fit rounded-lg p-5">
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Subtotal</span>
              <span className="font-semibold">{formatEur(subtotalCents)}</span>
            </div>
            <p className="mt-3 text-xs text-foreground-muted">
              Tax is calculated server-side. Displayed catalogue prices are treated as tax-inclusive by default.
            </p>
            <Button href="/checkout" className="mt-4 w-full">
              Proceed to checkout
            </Button>
          </aside>
        </div>
      )}
    </Container>
  );
}
