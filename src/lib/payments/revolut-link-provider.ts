import { nanoid } from "nanoid";
import type {
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  PaymentNotification,
  PaymentProviderAdapter,
  VerifyPaymentResult,
} from "./types";

/**
 * Revolut Pro static payment-link provider.
 * Instant redirects are resolved outside createCheckoutSession via resolveRevolutLinkPayment.
 * Webhooks are not available from Revolut Pro — admin marks orders paid manually.
 */
export class RevolutLinkPaymentProvider implements PaymentProviderAdapter {
  readonly name = "revolut_link";

  async createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult> {
    const redirectUrl = input.metadata?.redirectUrl;
    if (!redirectUrl) {
      throw new Error(
        "Revolut link checkout requires a matched static payment URL.",
      );
    }
    return {
      provider: this.name,
      redirectUrl,
      providerRef: input.metadata?.offerId || `revolut_link_${nanoid(12)}`,
    };
  }

  async parseNotification(
    _headers: Headers,
    _body: string,
  ): Promise<PaymentNotification> {
    throw new Error(
      "Revolut Pro payment links do not send webhooks. Mark the order paid in admin after confirming the payment in the Revolut app.",
    );
  }

  async verifyPayment(providerRef: string): Promise<VerifyPaymentResult> {
    return {
      status: "unknown",
      providerRef,
    };
  }
}
