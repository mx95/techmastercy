import { NextResponse } from "next/server";
import { CheckoutValidationError } from "@/lib/checkout";
import { siteConfig } from "@/lib/config";
import { prisma } from "@/lib/db";
import { createOrderFromCart } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";
import { checkoutSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const order = await createOrderFromCart(parsed.data);
    const provider = getPaymentProvider();
    const session = await provider.createCheckoutSession({
      orderId: order.id,
      orderReference: order.reference,
      amountCents: order.totalCents,
      currency: order.currency,
      customer: {
        email: order.customerEmail,
        name: order.customerName,
        phone: order.customerPhone || undefined,
        companyName: order.companyName || undefined,
        shippingAddress: order.shippingAddress || undefined,
      },
      returnUrl: `${siteConfig.appUrl}/order/${order.reference}`,
      cancelUrl: `${siteConfig.appUrl}/checkout?cancelled=1`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        providerRef: session.providerRef,
        paymentProvider: session.provider,
        paymentStatus: "REQUIRES_ACTION",
      },
    });

    return NextResponse.json({
      redirectUrl: session.redirectUrl,
      orderReference: order.reference,
    });
  } catch (error) {
    if (error instanceof CheckoutValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const message =
      error instanceof Error ? error.message : "Checkout failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
