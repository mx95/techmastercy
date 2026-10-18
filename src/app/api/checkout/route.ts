import { NextResponse } from "next/server";
import { CheckoutValidationError, validateCheckoutLines } from "@/lib/checkout";
import { getPaymentProviderName, siteConfig } from "@/lib/config";
import { prisma } from "@/lib/db";
import { createOrderFromCart } from "@/lib/orders";
import { getPaymentProvider } from "@/lib/payments";
import { resolveRevolutLinkPayment } from "@/lib/payments/revolut-link";
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
    const providerName = getPaymentProviderName();
    const customer = parsed.data.customer;

    if (providerName === "revolut_link") {
      const phone = customer.phone?.trim() || "";
      if (phone.length < 6) {
        return NextResponse.json(
          {
            error:
              "Phone number is required so we can send a Revolut payment link if your cart needs a custom link.",
          },
          { status: 400 },
        );
      }
    }

    const validated = await validateCheckoutLines(parsed.data.lines);
    const order = await createOrderFromCart(parsed.data);

    if (providerName === "revolut_link") {
      const resolution = resolveRevolutLinkPayment(
        validated.map((line) => ({
          slug: line.productSlug,
          quantity: line.quantity,
        })),
      );

      if (resolution.mode === "unconfigured") {
        return NextResponse.json({ error: resolution.message }, { status: 503 });
      }

      if (resolution.mode === "deferred") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            paymentProvider: "revolut_link",
            paymentStatus: "REQUIRES_ACTION",
            notes: [
              "revolut_link:deferred",
              resolution.message,
              `phone=${customer.phone?.trim() || ""}`,
            ].join("\n"),
          },
        });

        return NextResponse.json({
          mode: "deferred",
          orderReference: order.reference,
          message: resolution.message,
          redirectUrl: `${siteConfig.appUrl}/order/${order.reference}?awaiting=revolut`,
        });
      }

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
        metadata: {
          redirectUrl: resolution.redirectUrl,
          offerId: resolution.offer.id,
        },
      });

      await prisma.order.update({
        where: { id: order.id },
        data: {
          providerRef: session.providerRef,
          paymentProvider: session.provider,
          paymentStatus: "REQUIRES_ACTION",
          notes: `revolut_link:instant:${resolution.offer.id}`,
        },
      });

      return NextResponse.json({
        mode: "instant",
        redirectUrl: session.redirectUrl,
        orderReference: order.reference,
        offerLabel: resolution.offer.label,
      });
    }

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
      mode: "instant",
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
