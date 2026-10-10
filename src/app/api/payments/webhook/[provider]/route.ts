import { NextResponse } from "next/server";
import { applyPaymentNotification } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ provider: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const { provider } = await context.params;

  try {
    const adapter = getPaymentProvider();
    if (adapter.name !== provider) {
      return NextResponse.json(
        { error: "Payment provider mismatch." },
        { status: 400 },
      );
    }

    const body = await request.text();
    const notification = await adapter.parseNotification(request.headers, body);

    if (!notification.signatureValid) {
      return NextResponse.json(
        { error: "Invalid signature." },
        { status: 401 },
      );
    }

    const result = await applyPaymentNotification(notification);
    return NextResponse.json(
      {
        ok: true,
        alreadyProcessed: result.alreadyProcessed,
        orderId: result.orderId,
      },
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Webhook processing failed.";
    // Duplicate / race-safe path: treat known idempotent outcomes as success.
    if (
      message.includes("Unique constraint") ||
      message.includes("already") ||
      /unique/i.test(message)
    ) {
      return NextResponse.json({ ok: true, alreadyProcessed: true }, { status: 200 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
