import { NextResponse } from "next/server";
import { z } from "zod";
import {
  calculateOrderTotals,
  CheckoutValidationError,
  validateCheckoutLines,
} from "@/lib/checkout";
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
    return NextResponse.json({
      lines,
      subtotalCents: totals.subtotalCents,
      taxCents: totals.taxCents,
      shippingCents: totals.shippingCents,
      totalCents: totals.totalCents,
      taxInclusive: totals.taxInclusive,
      currency: "EUR",
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
