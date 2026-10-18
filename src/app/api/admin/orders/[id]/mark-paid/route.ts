import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { applyPaymentNotification } from "@/lib/orders";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

/**
 * Manual capture for Revolut Pro payment-link orders (no webhook).
 */
export async function POST(_request: Request, context: Context) {
  let admin;
  try {
    admin = await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await context.params;
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  if (order.paymentStatus === "CAPTURED" && order.status === "PAID") {
    return NextResponse.json({ ok: true, alreadyProcessed: true });
  }

  try {
    const result = await applyPaymentNotification({
      provider: order.paymentProvider || "revolut_link",
      providerEventId: `admin_mark_paid_${nanoid(16)}`,
      orderReference: order.reference,
      providerRef: order.providerRef || undefined,
      status: "paid",
      amountCents: order.totalCents,
      currency: order.currency,
      signatureValid: true,
      rawPayload: {
        source: "admin_mark_paid",
        adminEmail: admin.email,
        at: new Date().toISOString(),
      },
    });
    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not mark order paid.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
