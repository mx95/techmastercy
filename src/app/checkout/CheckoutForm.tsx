"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/site/Button";
import { formatEur } from "@/lib/money";

type Quote = {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  taxInclusive: boolean;
};

export function CheckoutForm() {
  const { lines, ready, clearCart } = useCart();
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || lines.length === 0) return;
    let cancelled = false;
    (async () => {
      setQuoteError(null);
      try {
        const res = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lines: lines.map((l) => ({
              productId: l.productId,
              licenceOptionId: l.licenceOptionId || null,
              quantity: l.quantity,
            })),
          }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setQuote(null);
          setQuoteError(data.error || "Could not validate cart prices.");
          return;
        }
        setQuote(data);
      } catch {
        if (!cancelled) setQuoteError("Could not validate cart prices.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lines, ready]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines.length) return;
    setStatus("loading");
    setError(null);
    const fd = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({
            productId: l.productId,
            licenceOptionId: l.licenceOptionId || null,
            quantity: l.quantity,
          })),
          customer: {
            email: String(fd.get("email") || ""),
            name: String(fd.get("name") || ""),
            phone: String(fd.get("phone") || ""),
            companyName: String(fd.get("companyName") || ""),
            shippingAddress: String(fd.get("shippingAddress") || ""),
          },
        }),
      });
      const data = (await res.json()) as {
        redirectUrl?: string;
        reference?: string;
        error?: string;
      };
      if (!res.ok || (!data.redirectUrl && !data.reference)) {
        setStatus("error");
        setError(data.error || "Checkout failed.");
        return;
      }
      clearCart();
      window.location.href = data.redirectUrl || `/order/${data.reference}`;
    } catch {
      setStatus("error");
      setError("Network error during checkout.");
    }
  }

  if (!ready) {
    return <p className="text-foreground-muted">Loading checkout…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/15 px-6 py-12 text-center">
        <p className="font-display text-xl font-semibold">Your cart is empty</p>
        <Button href="/shop" className="mt-4">
          Browse products
        </Button>
      </div>
    );
  }

  const needsShipping = lines.some((l) => l.type === "PHYSICAL");

  return (
    <form onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4 rounded-lg border border-white/10 bg-background-elevated/40 p-6">
        <h2 className="font-display text-lg font-semibold">Customer details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              autoComplete="name"
              className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="phone" className="text-sm font-medium">
              Phone (optional)
            </label>
            <input
              id="phone"
              name="phone"
              autoComplete="tel"
              className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="companyName" className="text-sm font-medium">
              Company (optional)
            </label>
            <input
              id="companyName"
              name="companyName"
              autoComplete="organization"
              className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
            />
          </div>
        </div>
        {needsShipping ? (
          <div>
            <label htmlFor="shippingAddress" className="text-sm font-medium">
              Shipping address
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              required
              rows={4}
              className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
            />
          </div>
        ) : (
          <input type="hidden" name="shippingAddress" value="" />
        )}
        <p className="text-xs text-foreground-muted">
          By placing an order you agree to the draft{" "}
          <a href="/terms" className="text-accent-soft hover:underline">
            terms
          </a>{" "}
          and{" "}
          <a href="/refunds" className="text-accent-soft hover:underline">
            refund policy
          </a>
          . Legal pages require review before launch.
        </p>
        <Button type="submit" disabled={status === "loading" || !!quoteError}>
          {status === "loading" ? "Starting payment…" : "Pay securely"}
        </Button>
        {error ? (
          <p role="status" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
      </div>

      <aside className="h-fit rounded-lg border border-white/10 bg-background-elevated/40 p-5">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li
              key={`${line.productId}-${line.licenceOptionId || "base"}`}
              className="flex justify-between gap-3"
            >
              <span className="text-foreground-muted">
                {line.name}
                {line.licenceName ? ` (${line.licenceName})` : ""} × {line.quantity}
              </span>
              <span>{formatEur(line.unitPriceCents * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-sm">
          {quoteError ? (
            <p className="text-danger">{quoteError}</p>
          ) : quote ? (
            <>
              <div className="flex justify-between">
                <span className="text-foreground-muted">
                  {quote.taxInclusive ? "Subtotal (ex. VAT portion)" : "Subtotal"}
                </span>
                <span>{formatEur(quote.subtotalCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted">VAT portion</span>
                <span>{formatEur(quote.taxCents)}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatEur(quote.totalCents)}</span>
              </div>
            </>
          ) : (
            <p className="text-foreground-muted">Validating prices…</p>
          )}
        </div>
      </aside>
    </form>
  );
}
