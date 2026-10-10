export type PaymentProviderInfo = {
  slug: string;
  name: string;
  region: "cyprus" | "international";
  summary: string;
  capabilities: string[];
  docsUrl: string;
  docsNote: string;
};

/**
 * Providers TechmasterCY can assess and potentially integrate.
 * Availability depends on merchant eligibility, account product, and official docs.
 * None of these imply completed client integrations or official partnerships.
 */
export const paymentProviders: PaymentProviderInfo[] = [
  {
    slug: "jcc",
    name: "JCC Payment Systems",
    region: "cyprus",
    summary:
      "Cyprus-focused acquiring and online payment gateway workflows used by many local merchants.",
    capabilities: [
      "Hosted / portal payment pages (product-dependent)",
      "Merchant portal and transaction operations",
      "Callbacks and order-status sync when configured",
    ],
    docsUrl: "https://gateway.jcc.com.cy/developer/en/integration/mportal3/mp3.html",
    docsNote:
      "Official JCC developer portal documentation (mPortal3). Exact APIs and credentials depend on the merchant product enabled on the account.",
  },
  {
    slug: "sixpay-saferpay",
    name: "SIX / Saferpay (SixPay)",
    region: "cyprus",
    summary:
      "Worldline Saferpay payment platform often referred to locally as SixPay / SIX Payment Services.",
    capabilities: [
      "Payment Page and Transaction interfaces",
      "Hosted checkout and wallet methods where enabled",
      "JSON API integrations subject to Saferpay licence",
    ],
    docsUrl: "https://docs.saferpay.com/home/",
    docsNote:
      "Official Saferpay documentation (docs.saferpay.com). Cyprus availability and acquirer setup must be confirmed for each merchant.",
  },
  {
    slug: "viva",
    name: "Viva.com / Viva Smart Checkout",
    region: "cyprus",
    summary:
      "European payments platform with Smart Checkout and API products used by many SMEs.",
    capabilities: [
      "Smart Checkout hosted flows",
      "Payment APIs and webhooks",
      "Card and wallet methods subject to account configuration",
    ],
    docsUrl: "https://developer.viva.com/api-docs/",
    docsNote:
      "Official Viva developer documentation. Smart Checkout docs: https://developer.viva.com/smart-checkout/smart-checkout-integration/",
  },
  {
    slug: "stripe",
    name: "Stripe",
    region: "international",
    summary:
      "Widely used payment APIs and Checkout for cards, wallets and subscription-style billing.",
    capabilities: [
      "Checkout / Payment Intents",
      "Webhooks and server-side verification",
      "Apple Pay / Google Pay where Stripe enables them for the account",
    ],
    docsUrl: "https://docs.stripe.com/",
    docsNote: "Official Stripe documentation. Country and product availability vary by Stripe account.",
  },
  {
    slug: "paypal",
    name: "PayPal",
    region: "international",
    summary: "Customer wallets and card checkout via PayPal Commerce / Orders APIs.",
    capabilities: [
      "Hosted PayPal checkout",
      "Orders / capture flows",
      "Webhook notifications",
    ],
    docsUrl: "https://developer.paypal.com/docs/",
    docsNote: "Official PayPal developer documentation.",
  },
  {
    slug: "revolut",
    name: "Revolut Pay / Revolut Merchant",
    region: "international",
    summary:
      "Revolut Merchant API and Revolut Pay for eligible merchant accounts.",
    capabilities: [
      "Merchant API orders and payments",
      "Revolut Pay where enabled",
      "Webhook / status handling",
    ],
    docsUrl: "https://developer.revolut.com/docs/merchant/",
    docsNote:
      "Official Revolut Merchant API docs. Integration guide: https://developer.revolut.com/docs/guides/merchant/introduction",
  },
  {
    slug: "adyen",
    name: "Adyen",
    region: "international",
    summary: "Enterprise payment platform with hosted and API checkout options.",
    capabilities: [
      "Sessions / Drop-in / Components",
      "Webhooks and reconciliation",
      "Multiple payment methods per merchant configuration",
    ],
    docsUrl: "https://docs.adyen.com/",
    docsNote: "Official Adyen documentation. Onboarding is typically contract-based.",
  },
  {
    slug: "checkout-com",
    name: "Checkout.com",
    region: "international",
    summary: "Global payments API with hosted and embedded checkout products.",
    capabilities: [
      "Payments API and hosted payment pages",
      "Webhooks",
      "Cards and alternative methods where supported",
    ],
    docsUrl: "https://www.checkout.com/docs",
    docsNote: "Official Checkout.com documentation.",
  },
];

export const paymentMethodsNote = {
  title: "Payment methods and wallets",
  body: "Apple Pay, Google Pay, card payments, hosted checkout, payment APIs and webhooks are capabilities that depend on the chosen provider, merchant account and platform—not standalone gateways by themselves. E-commerce platform plugins (for example WooCommerce or Shopify) may wrap the same providers with different constraints.",
};

export const paymentProvidersDisclaimer =
  "Listing a provider means TechmasterCY can assess documentation and help design or implement an integration where your merchant account and technical constraints allow. It does not mean every provider is available to every Cyprus business, that every integration has already been completed, or that TechmasterCY is an official partner or certified reseller of that provider.";
