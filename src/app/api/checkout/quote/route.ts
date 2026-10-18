import { NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateOrderTotals,
  CheckoutValidationError,
  validateCheckoutLines,
} from "@/lib/checkout";
import { getPaymentProviderName } from "@/lib/config";
import { resolveRevolutLinkPayment } from "@/lib/payments/revolut-link";
import { cartLineSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const quoteSchema = z.object({
  lines: z.array(cartLineSchema).min(1),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = quoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const lines = await validateCheckoutLines(parsed.data.lines);
    const totals = calculateOrderTotals(lines);
    const provider = getPaymentProviderName();

    let payment:
      | {
          provider: string;
          mode: "instant" | "deferred" | "unconfigured" | "gateway";
          offerLabel?: string;
          message?: string;
          requirePhone?: boolean;
        }
      | undefined;

    if (provider === "revolut_link") {
      const resolution = resolveRevolutLinkPayment(
        lines.map((line) => ({
          slug: line.productSlug,
          quantity: line.quantity,
        })),
      );
      payment = {
        provider,
        mode: resolution.mode,
        offerLabel: resolution.offer?.label,
        message: resolution.message,
        requirePhone: true,
      };
    } else {
      payment = {
        provider,
        mode: "gateway",
        requirePhone: false,
      };
    }

    return NextResponse.json({
      lines,
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      taxInclusive: totals.taxInclusive,
      currency: "EUR",
      payment,
    });
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "Quote failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
