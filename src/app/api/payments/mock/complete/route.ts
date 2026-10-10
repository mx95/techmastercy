import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { isMockPaymentsAllowed, siteConfig } from "@/lib/config";
import { applyPaymentNotification } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isMockPaymentsAllowed()) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const url = new URL(request.url);
  const orderReference = url.searchParams.get("order");
  const providerRef = url.searchParams.get("ref") || undefined;
  const amountRaw = url.searchParams.get("amount");
  const amountCents = amountRaw ? Number(amountRaw) : undefined;

  if (!orderReference) {
    return NextResponse.json(
      { error: "Missing order reference." },
      { status: 400 },
    );
  }

  const secret = process.env.MOCK_WEBHOOK_SECRET || "mock-dev-secret";

  try {
    await applyPaymentNotification({
      provider: "mock",
      providerEventId: `mock_complete_${nanoid(12)}`,
      orderReference,
      providerRef,
      status: "paid",
      amountCents: Number.isFinite(amountCents) ? amountCents : undefined,
      currency: "EUR",
      rawPayload: {
        orderReference,
        providerRef,
        amountCents,
        secret,
        source: "mock-complete",
      },
      signatureValid: true,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Mock payment failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  return NextResponse.redirect(
    new URL(`/order/${encodeURIComponent(orderReference)}`, siteConfig.appUrl),
  );
}
