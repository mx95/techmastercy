import type {
  CreateCheckoutSessionInput,
  CreateCheckoutSessionResult,
  PaymentNotification,
  PaymentProviderAdapter,
  VerifyPaymentResult,
} from "./types";
import { getJccConfig } from "@/lib/config";

/**
 * JCC adapter skeleton.
 *
 * Real endpoint paths, request bodies, signature schemes and callback formats
 * must be taken from official JCC merchant documentation for the specific
 * integration product enabled on the merchant account.
 *
 * This class intentionally throws until those credentials and docs are configured.
 * Do not invent undocumented JCC API behaviour.
 */
export class JccPaymentProvider implements PaymentProviderAdapter {
  readonly name = "jcc";

  private assertConfigured() {
    const cfg = getJccConfig();
    if (!cfg.merchantId || !cfg.baseUrl || !cfg.apiKey) {
      throw new Error(
        "JCC payment provider is selected but merchant credentials/base URL are not configured. See docs/PAYMENTS.md.",
      );
    }
    return cfg;
  }

  async createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult> {
    this.assertConfigured();
    void input;
    throw new Error(
      "JCC checkout session creation is not yet wired to official merchant API documentation. Configure JCC_* env vars and implement the documented request mapping in src/lib/payments/jcc-provider.ts.",
    );
  }

  async parseNotification(
    headers: Headers,
    body: string,
  ): Promise<PaymentNotification> {
    this.assertConfigured();
    void headers;
    void body;
    throw new Error(
      "JCC webhook/callback parsing is not yet implemented against official documentation.",
    );
  }

  async verifyPayment(providerRef: string): Promise<VerifyPaymentResult> {
    this.assertConfigured();
    void providerRef;
    throw new Error(
      "JCC payment verification is not yet implemented against official documentation.",
    );
  }
}
