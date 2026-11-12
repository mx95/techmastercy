export type SeoLander = {
  slug: string;
  /** Path under site root, e.g. /stripe-integration */
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  problems: string[];
  solutions: string[];
  implementation: string[];
  faqs: Array<{ q: string; a: string }>;
  relatedPaths: Array<{ href: string; label: string }>;
  contactService: string;
  schemaName: string;
  schemaDescription: string;
};

/**
 * Commercial landers for high-intent queries.
 * Distinct from /services/* delivery pages: these emphasise buyer problems,
 * engagement outcomes and international delivery without fake partnerships.
 */
export const seoLanders: SeoLander[] = [
  {
    slug: "payment-integration",
    path: "/payment-integration",
    title: "Payment integration services",
    metaTitle: "Payment gateway integration services",
    metaDescription:
      "Hire TechmasterCY for payment gateway and payment API integration: server-side verification, webhooks, 3DS-ready flows and troubleshooting—from Cyprus to international projects.",
    h1: "Payment gateway integration services",
    intro:
      "TechmasterCY designs and implements payment integrations for websites, ecommerce platforms and custom applications. Work is scoped around how your systems must treat “paid”, not around a one-size plugin guess. We are a Cyprus-based engineering team and take on international remote projects.",
    problems: [
      "Checkout looks successful in the browser but orders stay unpaid or stuck",
      "Provider documentation does not match the product enabled on your merchant account",
      "Callbacks arrive twice, late, or never—and fulfilment logic is unsafe",
      "You need cards, wallets or 3-D Secure without rewriting the whole storefront",
      "An existing integration needs an audit before you trust production traffic",
    ],
    solutions: [
      "Gateway and hosted-checkout integration against official provider docs",
      "Server-side session creation and amount verification before fulfilment",
      "Webhook receivers with idempotency and clear order-status mapping",
      "Failure, decline and cancellation paths operators can understand",
      "Staging test plans and handover notes for your team",
    ],
    implementation: [
      "Discovery: platforms, merchant products, and what “paid” must mean in your domain",
      "Design: hosted vs API checkout, callback URLs, retries and reconciliation",
      "Build: implement against staging credentials and documented endpoints only",
      "Verify: success, decline, duplicate notification and timeout scenarios",
      "Handover: configuration notes and an agreed go-live support window",
    ],
    faqs: [
      {
        q: "Do you only work with Cyprus merchants?",
        a: "No. TechmasterCY is based in Cyprus and regularly supports international projects remotely. Some providers (for example JCC) are Cyprus-oriented; others such as Stripe are used wherever your account is eligible.",
      },
      {
        q: "Are you an official partner of Stripe, JCC or other providers?",
        a: "No official partnership or certification is claimed. We integrate as independent engineers using each provider’s published documentation and your merchant credentials.",
      },
      {
        q: "Can you fix an integration someone else built?",
        a: "Yes. Payment troubleshooting and audits are a common engagement: we trace callbacks, amounts and status transitions before proposing a fix.",
      },
    ],
    relatedPaths: [
      { href: "/services/payment-solutions", label: "Payment Solutions pillar" },
      { href: "/stripe-integration", label: "Stripe integration" },
      { href: "/payment-webhooks", label: "Payment webhooks" },
      { href: "/3ds-integration", label: "3DS integration" },
      { href: "/services/payment-troubleshooting", label: "Payment troubleshooting" },
    ],
    contactService: "payment-gateway-integration",
    schemaName: "Payment gateway integration services",
    schemaDescription:
      "Payment gateway and payment API integration with server-side verification, webhooks and operational handover.",
  },
  {
    slug: "stripe-integration",
    path: "/stripe-integration",
    title: "Stripe integration services",
    metaTitle: "Stripe integration services",
    metaDescription:
      "Stripe Checkout, Payment Intents, webhooks and subscription-ready flows implemented with server-side verification. Independent Stripe integration engineering from TechmasterCY.",
    h1: "Stripe integration services",
    intro:
      "Need Stripe connected to a custom app, SaaS billing flow or storefront without fragile client-only hacks? TechmasterCY implements Stripe using official APIs: Checkout Sessions or Payment Intents as appropriate, signed webhooks, and fulfilment that only runs after verified payment state.",
    problems: [
      "Client-side Stripe.js alone is being treated as proof of payment",
      "Webhook endpoint is missing, unsigned, or not idempotent",
      "Test mode works; live mode fails on amounts, currencies or return URLs",
      "Subscriptions, trials or one-off invoices need clearer status mapping",
      "You want Stripe without rewriting your entire product UI",
    ],
    solutions: [
      "Checkout Session or Payment Intents design matched to your product",
      "Server-created payment objects with trusted amounts and metadata",
      "Signed webhook handling for payment success, failure and disputes signals you choose to act on",
      "Environment separation for test and live keys",
      "Clear runbooks for operators when a payment needs manual review",
    ],
    implementation: [
      "Confirm Stripe account readiness and which Stripe products you will use",
      "Choose Checkout vs Elements/Intents based on UX and control needs",
      "Implement create-session (or intent) endpoints and success/cancel routes as UX only",
      "Add webhook verification and idempotent order transitions",
      "Exercise declines, 3DS challenges (where applicable) and duplicate events in test mode",
    ],
    faqs: [
      {
        q: "Are you a Stripe partner or certified expert programme member?",
        a: "No. We do not claim Stripe partnership or certification. Integrations follow Stripe’s public documentation and your account configuration.",
      },
      {
        q: "Can you migrate from another gateway to Stripe?",
        a: "Often yes. Migration scope depends on historical order data, refunds and whether you need dual-run during cutover.",
      },
      {
        q: "Do you support Stripe Tax, Connect or Billing?",
        a: "We can scope those Stripe products when they are enabled on your account. Complexity and pricing depend on the exact product surface.",
      },
    ],
    relatedPaths: [
      { href: "/payment-integration", label: "Payment integration services" },
      { href: "/payment-webhooks", label: "Payment webhooks" },
      { href: "/3ds-integration", label: "3DS integration" },
      { href: "/services/payment-solutions", label: "Payment Solutions" },
    ],
    contactService: "payment-gateway-integration",
    schemaName: "Stripe integration services",
    schemaDescription:
      "Independent Stripe Checkout and Payment Intents integration with verified webhooks and server-side fulfilment rules.",
  },
  {
    slug: "jcc-integration",
    path: "/jcc-integration",
    title: "JCC payment integration",
    metaTitle: "JCC payment gateway integration",
    metaDescription:
      "JCC payment gateway integration for Cyprus merchants: hosted checkout, callbacks, staging discipline and operational handover by TechmasterCY.",
    h1: "JCC payment gateway integration",
    intro:
      "JCC is a common card-acquiring path for Cyprus businesses. TechmasterCY implements JCC payment flows as an independent integrator—matching the product enabled on your merchant account, not undocumented shortcuts—and hardening callbacks so orders update safely.",
    problems: [
      "Merchant credentials exist but the technical product and docs are unclear",
      "Return URLs are treated as payment confirmation",
      "Staging and production callback URLs are mixed or unreachable",
      "Declines and cancellations leave orders in ambiguous states",
      "You need WooCommerce, custom PHP/Node or another stack wired correctly",
    ],
    solutions: [
      "Integration against the JCC product actually enabled for your MID",
      "Server-side verification patterns appropriate to that product",
      "Callback/webhook handling with duplicate protection",
      "Status map for paid, declined, cancelled and error cases",
      "Staging checklist before production traffic",
    ],
    implementation: [
      "Confirm merchant access, enabled JCC product and official documentation",
      "Prepare staging credentials and reachable callback URLs",
      "Implement checkout initiation and trusted status updates",
      "Test success, decline, cancel and duplicate notification paths",
      "Document configuration for your operators and developers",
    ],
    faqs: [
      {
        q: "Are you an official JCC partner?",
        a: "No. TechmasterCY does not claim official JCC partnership or certification. We integrate using official documentation and your merchant credentials.",
      },
      {
        q: "Can international companies use JCC through you?",
        a: "JCC eligibility is determined by JCC and your merchant agreement. We implement the technical integration when your account allows it; we cannot grant acquiring access.",
      },
      {
        q: "How does this relate to your longer JCC service page?",
        a: "This page is the commercial overview. Delivery detail and packaging also live under /services/jcc-payment-integration.",
      },
    ],
    relatedPaths: [
      { href: "/services/jcc-payment-integration", label: "JCC service detail" },
      { href: "/payment-integration", label: "Payment integration services" },
      { href: "/articles/jcc-integration-checklist-cyprus", label: "JCC checklist article" },
      { href: "/services/payment-solutions", label: "Payment Solutions" },
    ],
    contactService: "jcc-payment-integration",
    schemaName: "JCC payment gateway integration",
    schemaDescription:
      "JCC payment gateway integration for eligible merchants, with staging discipline and safe order-status updates.",
  },
  {
    slug: "payment-webhooks",
    path: "/payment-webhooks",
    title: "Payment webhook development",
    metaTitle: "Payment webhook development",
    metaDescription:
      "Payment webhook implementation: signature verification, idempotency, retries and order-state updates that stay correct under duplicate events.",
    h1: "Payment webhook development",
    intro:
      "Payment providers retry. Networks delay. Your receiver must accept the same paid event twice without shipping twice. TechmasterCY builds and hardens payment webhook endpoints so fulfilment follows verified provider events—not browser redirects.",
    problems: [
      "Webhooks are unauthenticated or secrets are hard-coded in multiple places",
      "Duplicate events create double fulfilment or double accounting entries",
      "Events arrive out of order relative to customer redirects",
      "Timeouts cause provider retries that your code treats as new payments",
      "No durable event log for support teams to inspect",
    ],
    solutions: [
      "Signature verification using the provider’s documented scheme",
      "Idempotency keys / provider event IDs stored before side effects complete",
      "Amount and currency checks against your order of record",
      "Explicit handling for success, failure and ignored event types",
      "Operational logging that never stores raw card data",
    ],
    implementation: [
      "Inventory which event types you must honour for fulfilment",
      "Design idempotent processing and failure retry behaviour",
      "Implement verify → persist event → transition order → acknowledge",
      "Load-test duplicate delivery and delayed delivery cases",
      "Document how support should replay or mark events manually if needed",
    ],
    faqs: [
      {
        q: "Is a thank-you page enough if webhooks are hard?",
        a: "No. Return URLs are a user-experience signal. Authoritative payment state should come from verified server-side events or authenticated status APIs.",
      },
      {
        q: "Do you only build webhooks for Stripe?",
        a: "No. The same patterns apply across providers (Stripe, JCC product callbacks, Revolut and others) with provider-specific verification details.",
      },
    ],
    relatedPaths: [
      { href: "/payment-integration", label: "Payment integration services" },
      { href: "/stripe-integration", label: "Stripe integration" },
      { href: "/services/api-webhook-integration", label: "API & webhook service" },
      { href: "/articles/idempotent-payment-webhooks", label: "Idempotent webhooks article" },
    ],
    contactService: "api-webhook-integration",
    schemaName: "Payment webhook development",
    schemaDescription:
      "Design and implementation of idempotent, signature-verified payment webhook receivers.",
  },
  {
    slug: "3ds-integration",
    path: "/3ds-integration",
    title: "3DS authentication integration",
    metaTitle: "3DS integration services",
    metaDescription:
      "3-D Secure (3DS) authentication integration for card checkouts: challenge flows, liability notes at a high level, and order states that match ACS outcomes.",
    h1: "3DS authentication integration",
    intro:
      "3-D Secure adds an authentication step that can succeed, fail or be unavailable depending on issuer and provider configuration. TechmasterCY helps you wire 3DS-capable payment flows so your application’s order state reflects the real authentication and authorisation outcome—not a guessed browser redirect.",
    problems: [
      "Checkout drops customers during challenge with no recoverable order state",
      "Frictionless and challenged paths are not both tested",
      "“Authenticated” is confused with “authorised / captured”",
      "Mobile WebViews break return URLs for the challenge",
      "Support cannot tell why a payment stopped at authentication",
    ],
    solutions: [
      "Provider-native 3DS where your merchant product requires or offers it",
      "Clear mapping from authentication results into your domain statuses",
      "UX copy and recovery paths when authentication is abandoned",
      "Test coverage for challenged and frictionless outcomes in staging",
      "Logging that helps support without storing sensitive authentication payloads",
    ],
    implementation: [
      "Confirm whether 3DS is mandated by your acquirer/provider setup",
      "Implement the provider’s recommended authentication integration path",
      "Separate authentication outcome from capture/fulfilment rules",
      "Test issuer challenge, frictionless success and failure cases",
      "Document operator steps when a customer completes pay later after a failed challenge",
    ],
    faqs: [
      {
        q: "Do you guarantee liability shift?",
        a: "No. Liability shift depends on scheme rules, provider configuration and transaction specifics. We implement the technical flow; we do not promise legal or scheme outcomes.",
      },
      {
        q: "Is 3DS only for Europe?",
        a: "Strong Customer Authentication is common in Europe, but 3DS appears in many markets. We implement what your provider and merchant setup require.",
      },
    ],
    relatedPaths: [
      { href: "/payment-integration", label: "Payment integration services" },
      { href: "/stripe-integration", label: "Stripe integration" },
      { href: "/services/payment-solutions", label: "Payment Solutions" },
    ],
    contactService: "payment-gateway-integration",
    schemaName: "3DS authentication integration",
    schemaDescription:
      "3-D Secure authentication integration aligned with provider flows and accurate order-state handling.",
  },
  {
    slug: "api-development",
    path: "/api-development",
    title: "API development services",
    metaTitle: "API integration and development services",
    metaDescription:
      "Custom API development and third-party API integration: REST services, payment façades, webhooks and reliable system-to-system connections from TechmasterCY.",
    h1: "API integration and development services",
    intro:
      "When off-the-shelf connectors are not enough, TechmasterCY designs and builds APIs and integrations that connect your product to payment providers, CRMs, ERPs and internal tools. Emphasis is on clear contracts, authentication, observability and failure handling.",
    problems: [
      "Multiple systems need the same payment or order truth",
      "Third-party APIs are rate-limited, eventually consistent or poorly documented",
      "Internal teams need a stable façade in front of a changing provider",
      "Integrations fail silently without retries or alerts",
      "Security review requires clearer auth and secret handling",
    ],
    solutions: [
      "API design (REST-focused) with explicit resources and error shapes",
      "Integration adapters with timeouts, retries and idempotency where needed",
      "Payment orchestration façades when multiple channels share rules",
      "Webhook producers/consumers with verification",
      "Documentation and handover for your maintainers",
    ],
    implementation: [
      "Map systems, data ownership and non-functional requirements",
      "Propose API or adapter boundaries and auth approach",
      "Implement against staging dependencies with contract tests where useful",
      "Add logging/metrics hooks your operators can use",
      "Handover with sequence diagrams for the critical paths",
    ],
    faqs: [
      {
        q: "Do you only build payment APIs?",
        a: "Payment APIs are a specialty, but we also integrate other business APIs when they sit next to checkout, fulfilment or automation work.",
      },
      {
        q: "Can you work in our existing codebase?",
        a: "Yes. Most engagements extend an existing application rather than replacing it.",
      },
    ],
    relatedPaths: [
      { href: "/services/software-api-development", label: "Software & API pillar" },
      { href: "/payment-webhooks", label: "Payment webhooks" },
      { href: "/payment-integration", label: "Payment integration" },
      { href: "/services/api-webhook-integration", label: "API & webhook service" },
    ],
    contactService: "api-webhook-integration",
    schemaName: "API development and integration services",
    schemaDescription:
      "Custom API development and third-party API integration with emphasis on reliability and clear contracts.",
  },
  {
    slug: "woocommerce-payment-integration",
    path: "/woocommerce-payment-integration",
    title: "WooCommerce payment integration",
    metaTitle: "WooCommerce payment integration services",
    metaDescription:
      "WooCommerce payment gateway setup and hardening: plugin configuration, callback reliability, and custom work when a plugin is not enough.",
    h1: "WooCommerce payment integration services",
    intro:
      "Many Cyprus and international merchants run WooCommerce and need card payments that update orders correctly. TechmasterCY configures and hardens WooCommerce payment integrations—and builds custom glue when the plugin, theme or gateway product combination is non-standard.",
    problems: [
      "Gateway plugin is installed but orders do not move to processing/completed",
      "3DS or wallet payments fail only on mobile",
      "Staging site cannot receive provider callbacks",
      "Theme or checkout customisations break gateway JavaScript",
      "You need JCC, Stripe or another provider wired with clearer support runbooks",
    ],
    solutions: [
      "Plugin selection and configuration matched to your merchant product",
      "Callback/webhook reachability and SSL checks",
      "Order-status mapping review for paid vs on-hold vs failed",
      "Custom development when plugins cannot express your flow",
      "Test checklist before switching payment methods live",
    ],
    implementation: [
      "Review WooCommerce version, PHP stack, theme and active checkout plugins",
      "Configure or replace the payment method with staging credentials",
      "Verify thank-you page behaviour versus authoritative payment state",
      "Test declines, cancels and successful paid orders end to end",
      "Document settings your store manager must not change casually",
    ],
    faqs: [
      {
        q: "Is this the same as your /services/woocommerce page?",
        a: "This URL targets commercial search for WooCommerce payment integration. Deeper packaging also exists at /services/woocommerce-payment-integration; both link to the same enquiry path.",
      },
      {
        q: "Do you build full WooCommerce stores?",
        a: "Primary focus is payment reliability and related integration. Broader store builds can be scoped separately if needed.",
      },
    ],
    relatedPaths: [
      {
        href: "/services/woocommerce-payment-integration",
        label: "WooCommerce service detail",
      },
      { href: "/jcc-integration", label: "JCC integration" },
      { href: "/stripe-integration", label: "Stripe integration" },
      { href: "/payment-integration", label: "Payment integration" },
    ],
    contactService: "woocommerce-payment-integration",
    schemaName: "WooCommerce payment integration services",
    schemaDescription:
      "WooCommerce payment gateway configuration, hardening and custom integration when plugins are insufficient.",
  },
];

export function getSeoLander(slug: string): SeoLander | undefined {
  return seoLanders.find((lander) => lander.slug === slug);
}

export function getSeoLanderByPath(path: string): SeoLander | undefined {
  const normalised = path.startsWith("/") ? path : `/${path}`;
  return seoLanders.find((lander) => lander.path === normalised);
}
