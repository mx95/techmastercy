"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/site/Button";
import { formatEur } from "@/lib/money";

type PaymentHint = {
  provider: string;
  mode: "instant" | "deferred" | "unconfigured" | "gateway";
  offerLabel?: string;
  message?: string;
  requirePhone?: boolean;
};

type Quote = {
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  taxInclusive: boolean;
  payment?: PaymentHint;
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
        orderReference?: string;
        mode?: string;
        message?: string;
        error?: string;
      };
      if (!res.ok || (!data.redirectUrl && !data.orderReference)) {
        setStatus("error");
        setError(data.error || "Checkout failed.");
        return;
      }
      clearCart();
      window.location.href =
        data.redirectUrl || `/order/${data.orderReference}`;
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
  const requirePhone = quote?.payment?.requirePhone === true;
  const payment = quote?.payment;
  const submitDisabled =
    status === "loading" || !!quoteError || payment?.mode === "unconfigured";

  const fieldClass =
    "mt-1 min-h-11 w-full max-w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm";

  let submitLabel = "Pay securely";
  if (status === "loading") submitLabel = "Starting payment…";
  else if (payment?.mode === "deferred") submitLabel = "Place order — link by email/phone";
  else if (payment?.mode === "instant") submitLabel = "Pay with Revolut";

  return (
    <form onSubmit={onSubmit} className="grid min-w-0 gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:gap-8">
      <div className="min-w-0 space-y-4 rounded-lg border border-white/10 bg-background-elevated/40 p-4 sm:p-6">
        <h2 className="font-display text-lg font-semibold">Customer details</h2>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="name" className="text-sm font-medium">
              Full name
            </label>
            <input
              id="name"
              name="name"
              required
              minLength={2}
              autoComplete="name"
              className={fieldClass}
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              required
              autoComplete="email"
              className={fieldClass}
            />
          </div>
        </div>
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone{requirePhone ? "" : " (optional)"}
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required={requirePhone}
              minLength={requirePhone ? 6 : undefined}
              autoComplete="tel"
              className={fieldClass}
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="companyName" className="text-sm font-medium">
              Company (optional)
            </label>
            <input
              id="companyName"
              name="companyName"
              autoComplete="organization"
              className={fieldClass}
            />
          </div>
        </div>
        {needsShipping ? (
          <div className="min-w-0">
            <label htmlFor="shippingAddress" className="text-sm font-medium">
              Shipping address
            </label>
            <textarea
              id="shippingAddress"
              name="shippingAddress"
              required
              rows={4}
              className="mt-1 min-h-28 w-full max-w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
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
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
        <div className="sticky bottom-0 z-10 -mx-4 border-t border-white/10 bg-background-elevated/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto"
            disabled={submitDisabled}
            aria-busy={status === "loading"}
          >
            {submitLabel}
          </Button>
        </div>
      </div>

      <aside className="order-first h-fit min-w-0 rounded-lg border border-white/10 bg-background-elevated/40 p-4 sm:p-5 lg:order-none">
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

        {payment?.provider === "revolut_link" ? (
          <div
            className={`mt-4 rounded-md border px-3 py-3 text-sm ${
              payment.mode === "deferred"
                ? "border-accent/40 bg-accent/10 text-foreground"
                : payment.mode === "unconfigured"
                  ? "border-danger/40 bg-danger/10 text-danger"
                  : "border-white/15 bg-background/40 text-foreground-muted"
            }`}
          >
            {payment.mode === "instant" ? (
              <p>
                Ready-made Revolut link for <strong>{payment.offerLabel}</strong>. You will be
                redirected to Revolut to pay.
              </p>
            ) : null}
            {payment.mode === "deferred" ? <p>{payment.message}</p> : null}
            {payment.mode === "unconfigured" ? <p>{payment.message}</p> : null}
          </div>
        ) : null}
      </aside>
    </form>
  );
}
