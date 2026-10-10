"use client";

import { useCart } from "@/components/cart/CartProvider";

export function CartButton() {
  const { itemCount, toggleCart, ready } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative inline-flex h-10 items-center gap-2 rounded-md border border-white/15 px-3 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-accent-dim"
      aria-label={`Open cart${ready && itemCount > 0 ? `, ${itemCount} items` : ""}`}
    >
      <span aria-hidden="true">Cart</span>
      <span className="inline-flex min-w-5 items-center justify-center rounded-sm bg-accent px-1.5 text-xs font-semibold text-background">
        {ready ? itemCount : 0}
      </span>
    </button>
  );
}
