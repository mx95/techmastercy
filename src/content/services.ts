export type ServicePricing = {
  label: string;
  fromEur?: number;
  note: string;
};

export type ServiceCategory = "payments" | "integrations" | "ai-automation";

export type ServicePage = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  category: ServiceCategory;
  problem: string;
  whoNeeds: string[];
  included: string[];
  deliverables: string[];
  process: string[];
  pricing: ServicePricing;
  faqs: Array<{ q: string; a: string }>;
  relatedKeywords: string[];
};

export const serviceCategories: Record<
  ServiceCategory,
  { title: string; description: string }
> = {
  payments: {
    title: "Payment integrations",
    description:
      "Gateway setup, JCC workflows, storefront payments and transaction troubleshooting.",
  },
  integrations: {
    title: "APIs, webhooks & custom systems",
    description:
      "Custom application payments, API integrations and reliable webhook handling.",
  },
  "ai-automation": {
    title: "AI, Automation & Technical Consulting",
    description:
      "Practical AI implementation, business process automation and scoped remote technical support.",
  },
};

export const services: ServicePage[] = [
  {
    slug: "payment-gateway-integration",
    title: "Payment gateway integration",
    shortTitle: "Payment gateway integration",
    category: "payments",
    summary:
      "Connect your website or application to an online payment gateway with a clear checkout flow, reliable callbacks and order updates.",
    problem:
      "Many businesses can take card payments in person but struggle to add a dependable online checkout that updates orders correctly when payments succeed, fail or arrive late.",
    whoNeeds: [
      "Businesses launching or upgrading online checkout in Cyprus",
      "Teams replacing fragile custom payment code",
      "Operators who need clearer payment and order status handling",
    ],
    included: [
      "Checkout flow design review",
      "Server-side payment session creation",
      "Callback / webhook handling with idempotency",
      "Order status mapping and failure paths",
      "Basic monitoring and troubleshooting guidance",
    ],
    deliverables: [
      "Working payment integration against the agreed environment",
      "Documented configuration and operational notes",
      "Handover of test scenarios for success, decline and duplicate notifications",
    ],
    process: [
      "Discovery call and current system review",
      "Technical proposal and indicative estimate",
      "Implementation in a staging environment",
      "Test checklist and go-live support window",
    ],
    pricing: {
      label: "Indicative project pricing",
      fromEur: 450,
      note: "Final price depends on platform, provider, and existing codebase. Request a quote for a fixed estimate.",
    },
    faqs: [
      {
        q: "Do you work with my existing website?",
        a: "Yes. Integrations are usually added to an existing store, CMS or custom application rather than rebuilding the whole site.",
      },
      {
        q: "Can you help choose a payment provider?",
        a: "I can outline technical trade-offs. Provider selection also depends on your merchant account eligibility and commercial terms.",
      },
    ],
    relatedKeywords: ["Payment gateway integration Cyprus", "Custom online payment integration"],
  },
  {
    slug: "jcc-payment-integration",
    title: "JCC payment integration",
    shortTitle: "JCC payment integration",
    category: "payments",
    summary:
      "Implement JCC payment workflows for Cyprus businesses, including checkout sessions, server-side verification and order synchronization.",
    problem:
      "JCC integrations need careful handling of merchant configuration, callbacks and order state. Incomplete implementations often leave paid orders unmarked or expose insecure client-side assumptions.",
    whoNeeds: [
      "Cyprus merchants using or migrating to JCC",
      "Agencies needing a backend-focused JCC implementation",
      "Teams troubleshooting unreliable JCC callbacks",
    ],
    included: [
      "Merchant-configuration readiness checklist",
      "Server-side checkout initiation",
      "Notification verification and idempotent processing",
      "Order paid / failed state handling",
      "Staging test plan",
    ],
    deliverables: [
      "Integration mapped to your merchant setup and official documentation",
      "Operational notes for support staff",
      "Guidance for production cut-over",
    ],
    process: [
      "Confirm merchant access and required JCC product documentation",
      "Implement against staging credentials",
      "Validate success, decline, duplicate and delayed notifications",
      "Support production enablement",
    ],
    pricing: {
      label: "Indicative project pricing",
      fromEur: 550,
      note: "Requires access to your JCC merchant documentation and credentials. TechmasterCY does not claim official JCC partnership or certification.",
    },
    faqs: [
      {
        q: "Are you an official JCC partner?",
        a: "No partnership or certification is claimed. Work is performed as an independent technical integrator using your merchant credentials and official documentation.",
      },
      {
        q: "What do you need from me to start?",
        a: "Merchant account access details, the applicable JCC integration documentation for your product, staging credentials, and a description of your order system.",
      },
    ],
    relatedKeywords: ["JCC payment integration Cyprus"],
  },
  {
    slug: "woocommerce-payment-integration",
    title: "WooCommerce payment integration",
    shortTitle: "WooCommerce payments",
    category: "payments",
    summary:
      "Configure and harden WooCommerce payment flows so successful payments update orders and failed payments stay visible.",
    problem:
      "WooCommerce payment plugins can leave stores with mismatched order statuses, webhook gaps or unclear refund handling.",
    whoNeeds: [
      "WooCommerce stores in Cyprus accepting online payments",
      "Merchants changing payment providers",
      "Stores with intermittent paid-but-unfulfilled orders",
    ],
    included: [
      "Plugin / custom gateway assessment",
      "Checkout and webhook verification",
      "Order status mapping",
      "Refund and failure path review",
      "Staging validation",
    ],
    deliverables: [
      "Configured payment flow on staging and production",
      "Checklist for common WooCommerce payment issues",
      "Handover notes for store admins",
    ],
    process: [
      "Audit current WooCommerce and payment setup",
      "Implement or repair the integration",
      "Run purchase test scenarios",
      "Document operational checks",
    ],
    pricing: {
      label: "Indicative project pricing",
      fromEur: 350,
      note: "Scope depends on theme customisations, existing plugins and the payment provider.",
    },
    faqs: [
      {
        q: "Can you work with my current theme?",
        a: "Usually yes. Heavy checkout customisations may need extra work and will be identified during discovery.",
      },
    ],
    relatedKeywords: ["WooCommerce payment integration Cyprus"],
  },
  {
    slug: "shopify-payment-integration",
    title: "Shopify payment integration",
    shortTitle: "Shopify payments",
    category: "payments",
    summary:
      "Help Shopify merchants connect payment providers, review checkout behaviour and resolve order synchronization issues.",
    problem:
      "Shopify stores still need careful setup around payment providers, apps, webhooks and fulfilment workflows when connecting external systems.",
    whoNeeds: [
      "Shopify merchants in Cyprus",
      "Stores connecting Shopify orders to external systems",
      "Teams migrating away from fragile app configurations",
    ],
    included: [
      "Checkout and payment provider review",
      "Webhook / order sync assessment",
      "Failure and refund path review",
      "Integration recommendations",
    ],
    deliverables: [
      "Documented setup and recommended configuration",
      "Implemented changes within the agreed scope",
      "Test notes for checkout and order updates",
    ],
    process: [
      "Review store setup and apps",
      "Agree scope and constraints",
      "Implement and test",
      "Provide operational guidance",
    ],
    pricing: {
      label: "Indicative project pricing",
      fromEur: 300,
      note: "App marketplace limits and Shopify plan features can affect what is possible.",
    },
    faqs: [
      {
        q: "Can you build custom Shopify payment gateways?",
        a: "Custom payment apps have platform constraints. Discovery clarifies whether configuration, an existing app, or a custom approach is appropriate.",
      },
    ],
    relatedKeywords: ["Shopify payment integration Cyprus"],
  },
  {
    slug: "custom-application-payments",
    title: "Custom website and application payment integrations",
    shortTitle: "Custom app payments",
    category: "integrations",
    summary:
      "Add payment acceptance to custom websites and applications with server-validated totals, secure callbacks and clear order states.",
    problem:
      "Custom apps often calculate prices in the browser, trust redirects as payment proof, or lack idempotent webhook handling.",
    whoNeeds: [
      "Custom web apps and portals",
      "SaaS and booking products",
      "Internal business systems that need online payments",
    ],
    included: [
      "Server-side price validation design",
      "Checkout session and return handling",
      "Webhook verification and idempotency",
      "Order / entitlement updates",
      "Logging guidance for support",
    ],
    deliverables: [
      "Integration code against your stack where agreed",
      "Sequence diagrams or flow notes for the payment lifecycle",
      "Test matrix for common payment outcomes",
    ],
    process: [
      "Architecture review",
      "Implementation plan",
      "Build and staging validation",
      "Production support window",
    ],
    pricing: {
      label: "Indicative project pricing",
      fromEur: 650,
      note: "Depends on stack (for example Java/Spring Boot, .NET, Node) and existing order model.",
    },
    faqs: [
      {
        q: "Which stacks do you work with?",
        a: "Common work includes Java/Spring Boot, .NET, SQL-backed services, REST APIs and webhook-driven systems. Other stacks are assessed case by case.",
      },
    ],
    relatedKeywords: ["Custom online payment integration"],
  },
  {
    slug: "payment-troubleshooting",
    title: "Payment troubleshooting and transaction-flow investigation",
    shortTitle: "Payment troubleshooting",
    category: "payments",
    summary:
      "Investigate payment failures, missing order updates and inconsistent transaction states across checkout, provider and backend systems.",
    problem:
      "When customers are charged but orders stay pending—or checkout fails intermittently—revenue and trust both suffer.",
    whoNeeds: [
      "Stores with paid-but-unfulfilled orders",
      "Teams seeing intermittent callback failures",
      "Operators who need a clear root-cause analysis",
    ],
    included: [
      "End-to-end transaction flow review",
      "Log and webhook inspection guidance",
      "Identification of race conditions and duplicate events",
      "Remediation recommendations",
    ],
    deliverables: [
      "Findings summary with likely root cause(s)",
      "Prioritised fix list",
      "Optional implementation of agreed fixes",
    ],
    process: [
      "Collect failing references and timelines",
      "Trace checkout → provider → webhook → order update",
      "Report findings",
      "Implement fixes if requested",
    ],
    pricing: {
      label: "Indicative investigation pricing",
      fromEur: 180,
      note: "Short investigations are scoped in hours; larger remediation becomes a separate estimate.",
    },
    faqs: [
      {
        q: "Can you recover a stuck paid order?",
        a: "Often yes, once payment status is verified with the provider and your order records. Manual recovery steps depend on your systems.",
      },
    ],
    relatedKeywords: ["Online payment troubleshooting Cyprus"],
  },
  {
    slug: "api-webhook-integration",
    title: "API and webhook integration",
    shortTitle: "API & webhooks",
    category: "integrations",
    summary:
      "Design and implement REST API and webhook integrations with signature verification, retries, idempotency and clear failure handling.",
    problem:
      "Third-party webhooks arrive late, duplicated or out of order. Without idempotency and verification, systems double-process events or accept forged requests.",
    whoNeeds: [
      "Teams connecting payment, shipping or CRM systems",
      "Backend developers hardening webhook receivers",
      "Businesses replacing brittle polling jobs",
    ],
    included: [
      "Receiver design and authentication",
      "Signature verification",
      "Idempotency keys / event deduplication",
      "Retry and dead-letter strategy",
      "Observability basics",
    ],
    deliverables: [
      "Implemented or reviewed webhook/API flow",
      "Test payloads and failure scenarios",
      "Operational notes",
    ],
    process: [
      "Map event producers and consumers",
      "Implement or harden the integration",
      "Validate with replay and duplicate tests",
      "Handover",
    ],
    pricing: {
      label: "Indicative project pricing",
      fromEur: 400,
      note: "Digital product tooling for webhook reliability is also planned in the shop for self-serve use.",
    },
    faqs: [
      {
        q: "Do you provide Postman collections?",
        a: "Yes where useful for the engagement, and a reusable webhook kit is planned as a digital product.",
      },
    ],
    relatedKeywords: ["Webhook integration and testing tools"],
  },
  {
    slug: "business-process-automation",
    title: "Business process automation",
    shortTitle: "Business automation",
    category: "ai-automation",
    summary:
      "Eliminate repetitive manual work by connecting websites, CRMs, accounting tools and spreadsheets with reliable automations.",
    problem:
      "Manual order chasing, spreadsheet reconciliation and copy-paste updates between systems create delays, errors and missed follow-ups.",
    whoNeeds: [
      "Teams reconciling payments, invoices or appointments manually",
      "Businesses connecting storefronts to CRM or accounting tools",
      "Operators ready to replace fragile scripts with maintainable services",
    ],
    included: [
      "Process mapping for the agreed workflow",
      "Connecting websites, CRMs, accounting systems and spreadsheets where access allows",
      "Automating data imports/exports and recurring reports",
      "Order, invoice and appointment notifications",
      "Enquiry routing and third-party API / webhook integrations",
      "Error handling and basic alerting",
    ],
    deliverables: [
      "Working automation within the agreed scope",
      "Runbook for common failures",
      "Recommendations for safe next improvements",
    ],
    process: [
      "Map the current manual process and exception paths",
      "Identify safe automation boundaries and human checkpoints",
      "Build and test against real sample data where possible",
      "Monitor during initial use and hand over",
    ],
    pricing: {
      label: "Indicative project pricing",
      fromEur: 500,
      note: "Pricing depends on the number of systems involved. Third-party API or software charges are additional unless stated otherwise.",
    },
    faqs: [
      {
        q: "Will automation remove the need for staff review?",
        a: "Not always. Many automations still need human review for exceptions; the goal is to remove repetitive low-value steps.",
      },
      {
        q: "Can you automate anything ChatGPT can draft?",
        a: "No. Useful automation needs reliable system access, clear rules and testing. Generative AI is only used where it genuinely helps the workflow.",
      },
    ],
    relatedKeywords: [
      "Business process automation Cyprus",
      "Business systems integration Cyprus",
    ],
  },
  {
    slug: "ai-consulting-implementation",
    title: "AI consulting and implementation",
    shortTitle: "AI consulting & implementation",
    category: "ai-automation",
    summary:
      "Identify where AI can save time, then implement practical integrations into existing websites and business applications—with oversight, logging and cost awareness.",
    problem:
      "Generic AI tools do not resolve business problems on their own. Without integration, evaluation and human approval where it matters, experiments stay disconnected from real workflows.",
    whoNeeds: [
      "Businesses exploring AI but unsure where it helps",
      "Teams that need AI APIs connected to existing systems",
      "Operators who want document processing, support drafts or internal knowledge assistants with controls",
    ],
    included: [
      "AI readiness and workflow assessments",
      "Selecting suitable AI models and tools for a specific need",
      "Integrating AI APIs into websites and business applications where agreed",
      "AI-powered document processing and information extraction from approved sources",
      "AI-assisted customer support workflows with human review options",
      "Internal knowledge assistants limited to approved business documents",
      "Human approval workflows for consequential AI-generated actions",
      "Guidance on evaluation, logging, access control and cost monitoring",
    ],
    deliverables: [
      "Scoped assessment or implementation against an agreed workflow",
      "Configuration and operational notes",
      "Clear statement of what was tested and what still needs human review",
    ],
    process: [
      "Define the business problem and success criteria",
      "Assess tools, data sources and privacy constraints",
      "Implement and test before production reliance",
      "Handover with monitoring and escalation guidance",
    ],
    pricing: {
      label: "Indicative pricing",
      fromEur: 149,
      note: "Discovery starts from the proposed AI Discovery package; implementation is quoted from the proposed AI Implementation package. Third-party model/API charges are additional.",
    },
    faqs: [
      {
        q: "Do you guarantee AI accuracy?",
        a: "No. AI output can be wrong. Implementations emphasise testing, logging and human approval for consequential actions rather than promising perfect answers.",
      },
      {
        q: "Will you send our documents to a public AI service?",
        a: "Not without appropriate authorization. AI integrations are opt-in and configured per project with privacy constraints agreed up front.",
      },
    ],
    relatedKeywords: [
      "AI consulting Cyprus",
      "AI implementation for business",
      "AI integration Cyprus",
    ],
  },
  {
    slug: "technical-support",
    title: "Technical support and troubleshooting",
    shortTitle: "Technical support",
    category: "ai-automation",
    summary:
      "Remote technical support for businesses that need help with websites, APIs, payments, integrations and deployments—without claiming 24/7 coverage.",
    problem:
      "Not every business has an in-house specialist for every incident. Issues pile up across websites, webhooks, databases and deployments.",
    whoNeeds: [
      "SMEs without a full-time technical team",
      "Teams hitting payment, webhook or API failures",
      "Operators needing deployment, configuration or performance help",
    ],
    included: [
      "Website and API troubleshooting",
      "Payment gateway problem investigation",
      "Integration and webhook failure analysis",
      "Database and reporting issue support",
      "Deployment and configuration assistance",
      "Performance investigation within agreed scope",
      "Technical reviews and implementation guidance",
    ],
    deliverables: [
      "Investigation findings for the agreed issue",
      "Recommended fixes or next steps",
      "Optional implementation of agreed remediation",
    ],
    process: [
      "Capture symptoms, timelines and affected systems",
      "Investigate within the agreed scope and business hours",
      "Report findings and estimate any further work",
      "Implement fixes only when separately agreed",
    ],
    pricing: {
      label: "Indicative support pricing",
      fromEur: 99,
      note: "Monthly Technical Support packages and one-off investigations are available. Scope, business-hour availability and response expectations are confirmed in writing. Not unlimited and not 24/7.",
    },
    faqs: [
      {
        q: "Do you offer 24/7 support?",
        a: "No. Support is offered with clear scope, business-hour availability and response-time expectations. Immediate responses are not promised.",
      },
      {
        q: "Is support unlimited?",
        a: "No. Packages include a limited allowance. Additional work is quoted separately.",
      },
    ],
    relatedKeywords: [
      "Technical support for businesses Cyprus",
      "Website and API troubleshooting Cyprus",
    ],
  },
  {
    slug: "ai-automation-support-plans",
    title: "AI and automation support plans",
    shortTitle: "AI & support plans",
    category: "ai-automation",
    summary:
      "Configurable packages for AI discovery, focused implementation and limited monthly technical support—with clear inclusions and exclusions.",
    problem:
      "Businesses need a predictable way to start AI or automation work and keep light ongoing help without buying unlimited retainers.",
    whoNeeds: [
      "Teams wanting a low-commitment AI discovery step",
      "Businesses ready to implement one defined workflow",
      "Operators who need a limited monthly technical allowance",
    ],
    included: [
      "AI Discovery — consultation, one workflow review, recommendations",
      "AI Implementation — one defined workflow, integration where feasible, testing and handover",
      "Technical Support — limited monthly remote assistance and a monthly work summary",
    ],
    deliverables: [
      "Written proposal confirming package inclusions, exclusions and business hours",
      "Package deliverables as described for the selected plan",
      "Separate quotes for out-of-scope work",
    ],
    process: [
      "Choose a package or request a tailored mix",
      "Confirm scope, exclusions and third-party cost responsibility",
      "Deliver the agreed consultation, implementation or support period",
      "Review outcomes and decide next steps",
    ],
    pricing: {
      label: "Proposed package pricing",
      fromEur: 99,
      note: "AI Discovery €149 · AI Implementation from €399 · Technical Support €99/month. Proposed prices only—confirm before purchase. Third-party API/software charges are additional. No unlimited support.",
    },
    faqs: [
      {
        q: "Can I buy unlimited support?",
        a: "No. Packages are intentionally limited so expectations stay clear. Extra work is quoted separately.",
      },
      {
        q: "Are these market-validated prices?",
        a: "No. They are introductory proposals and may be adjusted in your quote.",
      },
    ],
    relatedKeywords: [
      "AI support plans Cyprus",
      "Business automation packages",
    ],
  },
];

export function getService(slug: string): ServicePage | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServicesByCategory(category: ServiceCategory): ServicePage[] {
  return services.filter((s) => s.category === category);
}
