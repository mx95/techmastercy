export type ArticleStatus = "published" | "draft";

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string[];
  status: ArticleStatus;
  /** ISO date when published; omit for drafts */
  publishedAt?: string;
  /** Commercial or service path for CTA */
  relatedPath: string;
  relatedLabel: string;
  /** Value for /contact?service= */
  contactService: string;
};

export const articles: Article[] = [
  {
    slug: "server-side-payment-verification",
    title: "Why a thank-you page is not proof of payment",
    description:
      "Explain why payment success must be verified on the server before fulfilling orders.",
    status: "published",
    publishedAt: "2026-09-01",
    relatedPath: "/payment-integration",
    relatedLabel: "Payment integration services",
    contactService: "payment-gateway-integration",
    body: [
      "When a customer returns from a hosted payment page, it is tempting to mark the order paid immediately. That redirect can be replayed, bookmarked, or reached after a cancelled attempt.",
      "A reliable integration creates the order and amount on the server, sends the customer to the provider, then waits for a verified callback or an authenticated status check before granting fulfilment or downloads.",
      "TechmasterCY designs checkouts this way for client systems and for this shop: browser success is a UX signal, not an authorization decision.",
    ],
  },
  {
    slug: "idempotent-payment-webhooks",
    title: "Handling duplicate and delayed payment webhooks",
    description:
      "How to process payment notifications safely when events arrive more than once or out of order.",
    status: "published",
    publishedAt: "2026-09-15",
    relatedPath: "/payment-webhooks",
    relatedLabel: "Payment webhook development",
    contactService: "api-webhook-integration",
    body: [
      "Payment providers retry webhooks. Networks delay packets. Your receiver must tolerate the same paid event arriving twice without shipping twice or issuing two download grants.",
      "Store a provider event identifier, ignore duplicates after successful processing, and compare paid amounts to the trusted order total before changing state.",
      "These patterns are also the foundation of the planned Webhook Reliability Kit for Java and Spring Boot developers.",
    ],
  },
  {
    slug: "jcc-integration-checklist-cyprus",
    title: "JCC integration checklist for Cyprus merchants",
    description:
      "A practical checklist before starting a JCC payment integration project in Cyprus.",
    status: "published",
    publishedAt: "2026-10-01",
    relatedPath: "/jcc-integration",
    relatedLabel: "JCC payment integration",
    contactService: "jcc-payment-integration",
    body: [
      "Confirm you have merchant access and the official documentation for the specific JCC product enabled on your account. Integration details vary; undocumented endpoints should not be invented.",
      "Prepare staging credentials, callback URLs that reach your server, and a clear map of order statuses for success, decline, cancellation and refund.",
      "TechmasterCY can implement and harden the technical flow as an independent integrator. No official JCC partnership or certification is claimed.",
    ],
  },

  // --- Drafts for review (noIndex; excluded from sitemap & listing) ---
  {
    slug: "stripe-checkout-vs-payment-intents",
    title: "Stripe Checkout vs Payment Intents for custom apps",
    description:
      "Choose Stripe Checkout Sessions or Payment Intents based on control, branding and how your backend must treat payment state.",
    status: "draft",
    relatedPath: "/stripe-integration",
    relatedLabel: "Stripe integration services",
    contactService: "payment-gateway-integration",
    body: [
      "Stripe Checkout moves card collection and many compliance details into Stripe-hosted UI. Payment Intents (often with Elements) keep more of the experience inside your product. Neither option removes the need for server-side creation of payment objects and verified webhooks.",
      "Use Checkout when you want a fast, provider-hosted path with less PCI surface in your UI. Prefer Intents when you need tighter embedding, custom multi-step flows, or payment methods that your UX must orchestrate explicitly.",
      "In both models, create the Session or Intent on your server with the trusted amount and currency. Treat success_url / return URLs as navigation only. Fulfilment should wait for a verified `payment_intent.succeeded` (or equivalent) event—or an authenticated retrieve—before side effects.",
      "Subscriptions and Billing add state machines beyond one-off Intents. Scope those separately: trial endings, invoice payment failures and customer portal changes each need explicit handlers.",
      "If you are unsure which path fits, describe your UX constraints and we will recommend a Stripe-shaped approach without claiming Stripe partnership.",
    ],
  },
  {
    slug: "designing-idempotent-payment-webhooks",
    title: "Designing idempotent payment webhook receivers",
    description:
      "A practical pattern for verifying, storing and applying payment provider events without double fulfilment.",
    status: "draft",
    relatedPath: "/payment-webhooks",
    relatedLabel: "Payment webhook development",
    contactService: "api-webhook-integration",
    body: [
      "Start from the provider’s event identifier. Persist it in a unique constraint before or within the same transaction as your order transition. If the insert conflicts, return success without applying side effects again.",
      "Verify signatures using the provider’s documented scheme and a secret loaded from environment configuration—not from source control. Reject bodies that fail verification; do not partially process them.",
      "Compare amounts and currency to your order of record. A paid event for the wrong amount is an incident, not a silent update. Log a structured error and keep the order in a review state.",
      "Acknowledge the webhook only after durable storage succeeds. If your process crashes after fulfilment but before ack, design fulfilment itself to be idempotent so a retry is safe.",
      "Keep a support-facing event log (without PAN/CVV) so operators can answer “did we receive paid?” without guessing from the thank-you page.",
    ],
  },
  {
    slug: "3ds-authenticated-order-state",
    title: "What “3DS authenticated” should mean in your order state",
    description:
      "Map 3-D Secure outcomes into domain statuses without confusing authentication with capture or fulfilment.",
    status: "draft",
    relatedPath: "/3ds-integration",
    relatedLabel: "3DS integration services",
    contactService: "payment-gateway-integration",
    body: [
      "Authentication and authorisation are related but not identical. A cardholder may pass 3DS and still fail authorisation, or in some setups authentication may be frictionless while authorisation declines.",
      "Model explicit states such as `awaiting_authentication`, `authentication_failed`, `authorised`, `captured` / `paid`, and `cancelled`. Collapsing everything into `pending` vs `paid` hides where customers drop off.",
      "When a challenge is abandoned, keep a recoverable cart or order reference. Customers often retry; your system should not create unbounded duplicate open orders without rules.",
      "Do not promise liability shift in product copy. Scheme outcomes depend on configuration and transaction details outside your UI code.",
      "Test both frictionless and challenged paths in staging with the cards your provider documents—not only the happy-path PAN that always succeeds.",
    ],
  },
  {
    slug: "reconcile-paid-amounts-before-fulfilment",
    title: "Reconcile paid amounts before fulfilment",
    description:
      "Why amount and currency checks belong in every payment webhook and status poll before you ship or unlock downloads.",
    status: "draft",
    relatedPath: "/payment-integration",
    relatedLabel: "Payment integration services",
    contactService: "payment-gateway-integration",
    body: [
      "Attackers and bugs both produce mismatches: a webhook for order A with amount B, partial captures, currency confusion (minor units), or test events hitting live handlers.",
      "Store the expected major/minor amount when the order is created. On payment success events, compare provider amount and currency with strict equality rules you document for rounding.",
      "If your provider supports partial capture, decide whether fulfilment waits for full capture or allows staged shipping. Encode that decision; do not improvise in the webhook handler.",
      "Refunds and chargebacks need reverse transitions. Fulfilment code that only listens for “paid” will ignore money moving back out.",
      "TechmasterCY treats amount reconciliation as a non-negotiable in payment integration projects—whether the stack is Stripe, JCC-oriented products, or another gateway.",
    ],
  },
  {
    slug: "jcc-hosted-checkout-staging-checklist",
    title: "JCC hosted checkout: staging checklist beyond credentials",
    description:
      "Operational checks Cyprus merchants should complete before pointing JCC callbacks at production.",
    status: "draft",
    relatedPath: "/jcc-integration",
    relatedLabel: "JCC payment integration",
    contactService: "jcc-payment-integration",
    body: [
      "Credentials alone are not readiness. Confirm which JCC product your MID enables and obtain that product’s current documentation. Endpoints and field names are not interchangeable across products.",
      "Staging callbacks must be reachable from the provider’s network over HTTPS with a valid certificate chain. Localhost tunnels are fine for development; production-like staging should mirror real DNS.",
      "Map decline, cancel and error codes to store statuses your staff already understand. “Failed” without a reason code slows support.",
      "Run at least one successful payment, one deliberate decline, one abandoned return, and one duplicate notification test before go-live.",
      "Keep an independent integrator posture: TechmasterCY implements against official docs and your account—no claimed JCC partnership.",
    ],
  },
  {
    slug: "woocommerce-plugin-vs-custom-gateway",
    title: "WooCommerce payment plugins vs custom gateway code",
    description:
      "Decide when a WooCommerce gateway plugin is enough—and when custom integration work is the safer path.",
    status: "draft",
    relatedPath: "/woocommerce-payment-integration",
    relatedLabel: "WooCommerce payment integration",
    contactService: "woocommerce-payment-integration",
    body: [
      "Prefer a maintained official or well-supported plugin when it matches your gateway product, currency and checkout customisations. Custom code is not automatically higher quality.",
      "Choose custom work when the plugin cannot express your order lifecycle, when theme/checkout JS conflicts are chronic, or when you need a façade shared with a non-WordPress channel.",
      "Regardless of approach, verify that paid status comes from trusted server-side confirmation. Thank-you templates that mark orders processing on page load recreate the redirect anti-pattern.",
      "Watch PHP timeouts and object-cache plugins that can interfere with callback handlers. Payment endpoints should be excluded from aggressive page caching.",
      "After changes, re-test wallets and 3DS on mobile—the most common place WooCommerce payment UX breaks in the wild.",
    ],
  },
  {
    slug: "paid-but-order-pending-playbook",
    title: "Debugging “customer paid but order still pending”",
    description:
      "A structured playbook for payment troubleshooting when money moved but your system did not.",
    status: "draft",
    relatedPath: "/services/payment-troubleshooting",
    relatedLabel: "Payment troubleshooting",
    contactService: "payment-troubleshooting",
    body: [
      "First separate provider truth from application truth. Retrieve the payment or transaction at the provider with authenticated APIs. Note status, amount, currency and timestamps.",
      "Check whether a webhook or callback was received, signature-valid, and applied. Missing events point to URL, firewall, or environment mismatches; received-but-ignored events point to handler bugs.",
      "Inspect idempotency keys: a previous failed attempt may have stored an event ID without completing the order transition—or the opposite.",
      "Confirm the customer’s return URL hit belongs to the same order reference the provider paid. Cross-tab checkouts create surprising mismatches.",
      "Only then manually mark paid—with an audit note—and fix the root cause before the next peak. TechmasterCY’s troubleshooting engagements follow this sequence rather than restarting the plugin first.",
    ],
  },
  {
    slug: "redirects-are-not-webhooks",
    title: "Safe retries: client redirects are not webhooks",
    description:
      "Why browser return URLs fail as a source of truth—and how to keep them useful as UX only.",
    status: "draft",
    relatedPath: "/payment-integration",
    relatedLabel: "Payment integration services",
    contactService: "payment-gateway-integration",
    body: [
      "Return URLs are optional from the provider’s perspective in many architectures. Users close tabs. Mobile OS reclaim WebViews. Bookmarks get shared.",
      "If your only “mark paid” path is the success page, you will under-fulfil when the redirect is lost and over-fulfil when it is replayed.",
      "Keep success pages informative: show order reference, next steps, and a soft refresh that re-queries your server’s order status. Never trust query-string flags such as `?paid=1` alone.",
      "Pair redirects with webhooks or server-side status polling with backoff. Polling is a backup, not a reason to skip signatures on events.",
      "Design customer emails from verified state changes. “We received your payment” should mean your ledger agrees with the provider.",
    ],
  },
  {
    slug: "map-provider-statuses-to-domain",
    title: "Mapping provider statuses to your domain model",
    description:
      "Build an explicit translation layer between gateway statuses and the states your business actually runs on.",
    status: "draft",
    relatedPath: "/api-development",
    relatedLabel: "API development services",
    contactService: "api-webhook-integration",
    body: [
      "Providers invent vocabularies: requires_action, processing, succeeded, captured, settled, charged_back. Your warehouse or licence server needs a smaller, stable set.",
      "Own a translation table in code—not scattered `if` statements in controllers. When the provider adds a status, you update one module.",
      "Illegal transitions should be impossible: `refunded` must not move back to `paid` without an explicit recommit path. Encode transition guards.",
      "Expose your domain statuses on an internal API so storefront, admin and automation agree. Divergent enums across services recreate the original chaos.",
      "Document the map for humans. Support teams should not need to read Stripe or JCC raw payloads to explain an order.",
    ],
  },
  {
    slug: "verify-payment-webhook-signatures",
    title: "Verifying payment webhook signatures without brittle secret handling",
    description:
      "Operational patterns for signature checks, secret rotation and safe logging around payment webhooks.",
    status: "draft",
    relatedPath: "/payment-webhooks",
    relatedLabel: "Payment webhook development",
    contactService: "api-webhook-integration",
    body: [
      "Load webhook secrets from the environment or a secret manager. Never commit them. Prefer dual-secret windows during rotation so in-flight retries still verify.",
      "Use constant-time comparison helpers provided by your stack when comparing digests. Implement the exact canonical string the provider documents—off-by-one in the signed payload is a common outage cause.",
      "Reject and metric-count verification failures. A sudden spike can mean an attack, a misconfigured endpoint, or a provider-side change.",
      "Log event IDs and order references, not full raw bodies if they may contain PII. Never log secrets or authorization headers.",
      "Separate “URL is reachable” health checks from “signature verifies in staging” drills. Both are required before go-live.",
    ],
  },
  {
    slug: "thin-payment-orchestration-api",
    title: "Building a thin payment orchestration API in front of a gateway",
    description:
      "When a small façade API helps multi-channel checkout share amounts, idempotency and webhook handling.",
    status: "draft",
    relatedPath: "/api-development",
    relatedLabel: "API development services",
    contactService: "api-webhook-integration",
    body: [
      "A thin orchestration API owns create-payment, cancel, and webhook ingestion for multiple clients (web, mobile, admin). It does not need to be a full BPM suite.",
      "Clients send your order ID and receive a redirect URL or client token. They never hold provider secret keys.",
      "Idempotency keys on create-payment prevent double sessions when mobile networks retry. Store the key with the payment attempt.",
      "Keep provider-specific SDKs inside the façade. Swapping Stripe Checkout for another gateway should not rewrite every client.",
      "This pattern is a common TechmasterCY API engagement when a business grows beyond a single WooCommerce plugin path.",
    ],
  },
  {
    slug: "payment-test-matrix-3ds-timeouts",
    title: "Test matrices for card payments: declines, 3DS and timeouts",
    description:
      "A go-live quality bar for payment integrations covering issuer challenges, declines and slow callbacks.",
    status: "draft",
    relatedPath: "/3ds-integration",
    relatedLabel: "3DS integration services",
    contactService: "payment-gateway-integration",
    body: [
      "Happy-path success is not a test plan. At minimum cover: authorised success, soft decline, hard decline, abandoned 3DS challenge, frictionless 3DS success, duplicate webhook, and delayed webhook after the customer already returned.",
      "Record expected order state after each case. If two engineers disagree on the expected state, the domain model is unfinished.",
      "Simulate provider latency: your HTTP server should not hold connections open forever waiting on secondary calls inside the webhook thread.",
      "Include mobile Safari and a common Android WebView when wallets or 3DS redirects are in scope.",
      "Keep the matrix in version control next to the integration. TechmasterCY includes an agreed matrix in handover for payment projects so go-live is evidence-based.",
    ],
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getPublishedArticles() {
  return articles.filter((a) => a.status === "published");
}

export function getDraftArticles() {
  return articles.filter((a) => a.status === "draft");
}
