import { nanoid } from "nanoid";
import {
  getPaymentProviderName,
  isMockPaymentsAllowed,
  siteConfig,
} from "@/lib/config";
import type {
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  PaymentNotification,
  PaymentProviderAdapter,
  VerifyPaymentResult,
} from "./types";

/**
 * Development-only mock payment provider.
 * Refuses to operate when mock payments are not explicitly allowed.
 */
export class MockPaymentProvider implements PaymentProviderAdapter {
  readonly name = "mock";

  private assertAllowed() {
    if (getPaymentProviderName() !== "mock" || !isMockPaymentsAllowed()) {
      throw new Error(
        "Mock payment provider is disabled. Set PAYMENT_PROVIDER=mock and ALLOW_MOCK_PAYMENTS=true only in non-production environments.",
      );
    }
  }

  async createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult> {
    this.assertAllowed();
    const providerRef = `mock_${nanoid(16)}`;
    const redirectUrl = new URL("/api/payments/mock/complete", siteConfig.appUrl);
    redirectUrl.searchParams.set("order", input.orderReference);
    redirectUrl.searchParams.set("ref", providerRef);
    redirectUrl.searchParams.set("amount", String(input.amountCents));
    return {
      provider: this.name,
      redirectUrl: redirectUrl.toString(),
      providerRef,
    };
  }

  async parseNotification(
    headers: Headers,
    body: string,
  ): Promise<PaymentNotification> {
    this.assertAllowed();
    const payload = JSON.parse(body) as {
      eventId?: string;
      orderReference?: string;
      providerRef?: string;
      status?: "paid" | "failed" | "pending" | "cancelled";
      amountCents?: number;
      currency?: string;
      secret?: string;
    };

    const expected = process.env.MOCK_WEBHOOK_SECRET || "mock-dev-secret";
    const signatureValid =
      headers.get("x-mock-signature") === expected || payload.secret === expected;

    return {
      provider: this.name,
      providerEventId: payload.eventId || `mock_evt_${nanoid(12)}`,
      orderReference: payload.orderReference || "",
      providerRef: payload.providerRef,
      status: payload.status || "pending",
      amountCents: payload.amountCents,
      currency: payload.currency,
      rawPayload: payload,
      signatureValid,
    };
  }

  async verifyPayment(providerRef: string): Promise<VerifyPaymentResult> {
    this.assertAllowed();
    if (!providerRef.startsWith("mock_")) {
      return { status: "unknown" };
    }
    return {
      status: "paid",
      providerRef,
    };
  }
}
