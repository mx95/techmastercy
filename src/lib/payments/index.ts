import { getPaymentProviderName, isMockPaymentsAllowed } from "@/lib/config";
import { JccPaymentProvider } from "./jcc-provider";
import { MockPaymentProvider } from "./mock-provider";
import type { PaymentProviderAdapter } from "./types";

export type * from "./types";

export function getPaymentProvider(): PaymentProviderAdapter {
  const name = getPaymentProviderName();

  if (name === "jcc") {
    return new JccPaymentProvider();
  }

  if (!isMockPaymentsAllowed()) {
    throw new Error(
      "Mock payments are not allowed in this environment. Set PAYMENT_PROVIDER=jcc with credentials, or use a non-production environment.",
    );
  }

  return new MockPaymentProvider();
}
