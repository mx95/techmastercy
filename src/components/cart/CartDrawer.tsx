"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/site/Button";
import { formatEur } from "@/lib/money";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    lines,
    subtotalCents,
    updateQuantity,
    removeItem,
    ready,
  } = useCart();
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [closeCart, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Close cart"
        onClick={closeCart}
      />
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-white/10 bg-background-elevated shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <h2 id={titleId} className="font-display text-lg font-semibold">
            Your cart
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="rounded-md px-2 py-1 text-sm text-foreground-muted hover:text-foreground"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {!ready ? (
            <p className="text-sm text-foreground-muted">Loading cart…</p>
          ) : lines.length === 0 ? (
            <div className="space-y-4 py-8 text-center">
              <p className="text-foreground-muted">Your cart is empty.</p>
              <Button href="/shop" variant="secondary" onClick={closeCart}>
                Browse the shop
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((line) => (
                <li
                  key={`${line.productId}-${line.licenceOptionId || "base"}`}
                  className="flex gap-3 border-b border-white/5 pb-4"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-background-soft">
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/shop/${line.slug}`}
                      onClick={closeCart}
                      className="line-clamp-2 text-sm font-medium hover:text-accent-soft"
                    >
                      {line.name}
                    </Link>
                    {line.licenceName ? (
                      <p className="text-xs text-foreground-muted">{line.licenceName}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-accent-soft">
                      {formatEur(line.unitPriceCents)}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <label className="sr-only" htmlFor={`qty-${line.productId}-${line.licenceOptionId || "b"}`}>
                        Quantity for {line.name}
                      </label>
                      <input
                        id={`qty-${line.productId}-${line.licenceOptionId || "b"}`}
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
                        className="w-16 rounded-md border border-white/15 bg-background px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        className="text-xs text-danger hover:underline"
                        onClick={() => removeItem(line.productId, line.licenceOptionId)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 ? (
          <div className="space-y-3 border-t border-white/10 px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground-muted">Subtotal</span>
              <span className="font-semibold">{formatEur(subtotalCents)}</span>
            </div>
            <p className="text-xs text-foreground-muted">
              Prices validated on the server at checkout. Tax shown as included where applicable.
            </p>
            <Button href="/checkout" className="w-full" onClick={closeCart}>
              Checkout
            </Button>
            <Button href="/cart" variant="secondary" className="w-full" onClick={closeCart}>
              View cart
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
