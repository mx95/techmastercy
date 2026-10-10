export type CheckoutLineInput = {
  productId: string;
  licenceOptionId?: string | null;
  quantity: number;
};

export type ValidatedCheckoutLine = {
  productId: string;
  productSlug: string;
  productName: string;
  productType: "DIGITAL" | "PHYSICAL";
  licenceOptionId: string | null;
  licenceName: string | null;
  unitPriceCents: number;
  quantity: number;
  lineTotalCents: number;
};

export type CheckoutCustomer = {
  email: string;
  name: string;
  phone?: string;
  companyName?: string;
  shippingAddress?: string;
};

export type CreateCheckoutSessionInput = {
  orderId: string;
  orderReference: string;
  amountCents: number;
  currency: string;
  customer: CheckoutCustomer;
  returnUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
};

export type CreateCheckoutSessionResult = {
  provider: string;
  redirectUrl: string;
  providerRef: string;
};

export type PaymentNotification = {
  provider: string;
  providerEventId: string;
  orderReference: string;
  providerRef?: string;
  status: "paid" | "failed" | "pending" | "cancelled";
  amountCents?: number;
  currency?: string;
  rawPayload: unknown;
  signatureValid: boolean;
};

export type VerifyPaymentResult = {
  status: "paid" | "failed" | "pending" | "cancelled" | "unknown";
  providerRef?: string;
  amountCents?: number;
  currency?: string;
  raw?: unknown;
};

export interface PaymentProviderAdapter {
  readonly name: string;
  createCheckoutSession(
    input: CreateCheckoutSessionInput,
  ): Promise<CreateCheckoutSessionResult>;
  parseNotification(
    headers: Headers,
    body: string,
  ): Promise<PaymentNotification>;
  verifyPayment(providerRef: string): Promise<VerifyPaymentResult>;
}
