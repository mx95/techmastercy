import { getService } from "@/content/services";

export type ServicePillarId =
  | "payment-solutions"
  | "software-api-development"
  | "ai-business-automation"
  | "digital-solutions";

export type ServicePillar = {
  id: ServicePillarId;
  /** URL segment under /services/ */
  slug: string;
  navLabel: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  problems: string[];
  offerings: string[];
  process: Array<{ title: string; body: string }>;
  technologies: string[];
  faqs: Array<{ q: string; a: string }>;
  /** Existing individual service slugs to link */
  serviceSlugs: string[];
  contactService: string;
  iconSrc: string;
  iconAlt: string;
  /** Stronger homepage emphasis */
  featured?: boolean;
  examples: string[];
};

export const servicePillars: ServicePillar[] = [
  {
    id: "payment-solutions",
    slug: "payment-solutions",
    navLabel: "Payment Solutions",
    title: "Payment Solutions",
    shortTitle: "Payments",
    summary: "Secure payment integrations that match how your business actually takes money.",
    description:
      "TechmasterCY helps businesses connect websites, shops and custom applications to payment providers—with server-side verification, webhooks and clear order status. Payment Solutions is the primary specialist focus.",
    problems: [
      "Checkout completes in the browser but orders stay unpaid or stuck",
      "Provider callbacks are unreliable, duplicated or hard to reconcile",
      "A storefront plugin does not match the merchant product you were given",
      "You need cards, wallets or 3-D Secure flows without guessing from incomplete docs",
      "An existing integration needs an audit before you trust production traffic",
    ],
    offerings: [
      "Payment gateway integration",
      "JCC, Stripe, Viva.com, Revolut Pay and other providers where your account allows",
      "Apple Pay / Google Pay where the provider enables them for the merchant",
      "3-D Secure (3DS) flows as required by the provider and scheme rules",
      "Payment API development and webhook implementation",
      "WooCommerce and Shopify payment setup",
      "Custom application payment flows",
      "Payment troubleshooting, audits and workflow automation around transactions",
    ],
    process: [
      {
        title: "Understand",
        body: "We review your platforms, merchant products and what “paid” must mean in your systems.",
      },
      {
        title: "Plan",
        body: "You get a scoped approach: hosted vs API checkout, callbacks, failure paths and testing.",
      },
      {
        title: "Build",
        body: "We implement against official documentation, verify amounts server-side and test edge cases.",
      },
      {
        title: "Support",
        body: "Handover notes and agreed follow-up help operators run the flow after go-live.",
      },
    ],
    technologies: [
      "Provider APIs and hosted checkouts",
      "REST webhooks and idempotent receivers",
      "WooCommerce / Shopify payment configuration",
      "Server-side order and amount verification",
      "Java / Spring Boot, .NET and SQL-backed services where relevant",
    ],
    faqs: [
      {
        q: "Which payment providers can you work with?",
        a: "We can assess and help integrate providers listed on this site—including JCC, Saferpay/SixPay, Viva.com, Stripe, PayPal, Revolut, Adyen and Checkout.com—when your merchant account and official documentation allow. Listing a provider is not a partnership claim.",
      },
      {
        q: "Do you guarantee every wallet method will work?",
        a: "No. Apple Pay, Google Pay and similar methods depend on the provider, merchant country and account configuration. We confirm what is available before promising a method.",
      },
      {
        q: "Can you fix a broken checkout?",
        a: "Yes—payment troubleshooting and integration audits are part of this service. We investigate status sync, callbacks, amounts and failure handling, then propose a scoped fix.",
      },
    ],
    serviceSlugs: [
      "payment-gateway-integration",
      "jcc-payment-integration",
      "woocommerce-payment-integration",
      "shopify-payment-integration",
      "custom-application-payments",
      "payment-troubleshooting",
    ],
    contactService: "payment-gateway-integration",
    iconSrc: "/images/services/payments.svg",
    iconAlt: "Payment solutions icon",
    featured: true,
    examples: ["Gateway setup", "JCC / Stripe / Viva", "Webhooks & audits"],
  },
  {
    id: "software-api-development",
    slug: "software-api-development",
    navLabel: "Software & API Development",
    title: "Software & API Development",
    shortTitle: "Software & APIs",
    summary: "Custom software, APIs and system integrations built to fit your requirements.",
    description:
      "When off-the-shelf tools fall short, TechmasterCY designs and builds practical backend services, REST APIs and integrations between the systems your business already uses.",
    problems: [
      "Two systems need to exchange data reliably and nobody owns the glue",
      "You need a REST API or webhook receiver that handles retries safely",
      "A business application should automate a workflow without fragile spreadsheets",
      "Database-backed services need clear contracts before other teams build on them",
    ],
    offerings: [
      "Custom software and business application development",
      "Backend development",
      "REST API development",
      "Third-party and system integrations",
      "Database-backed services",
      "Technical consulting on architecture and delivery scope",
    ],
    process: [
      {
        title: "Understand",
        body: "We clarify users, data flows and constraints before proposing technology choices.",
      },
      {
        title: "Plan",
        body: "Interfaces, ownership boundaries and a delivery scope you can review in plain language.",
      },
      {
        title: "Build",
        body: "Implement, test failure paths and document how operators should run the system.",
      },
      {
        title: "Support",
        body: "Agreed handover and optional follow-up support after delivery.",
      },
    ],
    technologies: [
      "REST APIs and webhooks",
      "Java / Spring Boot and .NET services",
      "SQL-backed data models",
      "Third-party API clients and authentication flows",
    ],
    faqs: [
      {
        q: "Do you only build payment-related software?",
        a: "Payments are a specialist focus, but software and API work also covers broader business integrations and custom backends when the scope is clear.",
      },
      {
        q: "Can you work with our existing codebase?",
        a: "Yes, when access and documentation allow. We prefer extending systems with clear contracts over rewriting for its own sake.",
      },
    ],
    serviceSlugs: ["api-webhook-integration", "custom-application-payments"],
    contactService: "api-webhook-integration",
    iconSrc: "/images/services/website-support.svg",
    iconAlt: "Software and API development icon",
    examples: ["REST APIs", "Integrations", "Backend services"],
  },
  {
    id: "ai-business-automation",
    slug: "ai-automation",
    navLabel: "AI & Automation",
    title: "AI & Business Automation",
    shortTitle: "AI & Automation",
    summary: "Practical AI and automation for real workflows—with human oversight where it matters.",
    description:
      "TechmasterCY helps teams adopt AI tools and automate repetitive processes without promising magic. Solutions are scoped to a business problem, tested before reliance, and designed with clear human review points.",
    problems: [
      "Staff repeat the same manual steps across tools every week",
      "You want AI assistance but need guardrails before production use",
      "Documents and data need structured processing before someone acts on them",
      "Systems should talk to each other instead of relying on copy-paste",
    ],
    offerings: [
      "AI integration into existing workflows",
      "Business process automation",
      "Intelligent workflows between applications",
      "AI-powered assistants with defined oversight",
      "Document and data processing where scope is clear",
      "Support plans after initial delivery",
    ],
    process: [
      {
        title: "Understand",
        body: "We identify the process, risks and where automation should stop for human review.",
      },
      {
        title: "Plan",
        body: "A scoped design with success criteria—not a vague “add AI” brief.",
      },
      {
        title: "Build",
        body: "Implement, test with realistic samples and document operator steps.",
      },
      {
        title: "Support",
        body: "Optional plans to monitor and adjust after go-live.",
      },
    ],
    technologies: [
      "Workflow automation between business apps",
      "AI APIs used behind clear application boundaries",
      "Human-in-the-loop review points",
      "Logging and failure handling for automated steps",
    ],
    faqs: [
      {
        q: "Will AI replace my team?",
        a: "That is not the promise. We focus on reducing repetitive work and assisting people—especially where mistakes have real consequences.",
      },
      {
        q: "Do you sell a proprietary AI product?",
        a: "No. Engagements use suitable tools and APIs for your case, with transparent scope and limitations.",
      },
    ],
    serviceSlugs: [
      "ai-consulting-implementation",
      "business-process-automation",
      "ai-automation-support-plans",
    ],
    contactService: "ai-consulting-implementation",
    iconSrc: "/images/services/ai.svg",
    iconAlt: "AI and automation icon",
    examples: ["AI setup", "Process automation", "Workflows"],
  },
  {
    id: "digital-solutions",
    slug: "digital-solutions",
    navLabel: "Digital Solutions",
    title: "Digital Solutions & Smart Technology",
    shortTitle: "Digital Solutions",
    summary: "Websites, e-commerce support, maintenance and smart technology consulting.",
    description:
      "Alongside core engineering work, TechmasterCY helps with website and e-commerce needs, scoped technical support, and practical consulting for smart home and related technology—kept secondary to payment and software delivery.",
    problems: [
      "A website or shop needs reliable maintenance without an open-ended retainer",
      "E-commerce payments or platform setup need technical help",
      "Cameras, hubs or finders need a coherent plan for home or small business use",
      "You want clear technology advice before buying more hardware",
    ],
    offerings: [
      "Website development and maintenance support",
      "E-commerce solutions and storefront payment setup",
      "Scoped remote technical support",
      "Smart home consulting and integration planning",
      "Broader technology consulting for small projects",
    ],
    process: [
      {
        title: "Understand",
        body: "We confirm the systems, urgency and what a successful outcome looks like.",
      },
      {
        title: "Plan",
        body: "A fixed scope with inclusions, exclusions and an estimate.",
      },
      {
        title: "Build",
        body: "Implement or advise, then verify the result against the agreed checklist.",
      },
      {
        title: "Support",
        body: "Notes for operators and optional follow-up within the agreed scope.",
      },
    ],
    technologies: [
      "Modern websites and storefront platforms",
      "Remote diagnostics for web and API issues",
      "Consumer and SMB smart devices (planning and integration advice)",
    ],
    faqs: [
      {
        q: "Is smart home work the main focus?",
        a: "No. It is available as a secondary service. Payment integrations and software engineering remain the primary positioning.",
      },
      {
        q: "Do you offer unlimited support retainers?",
        a: "Support is scoped—business hours, clear findings and agreed boundaries—so you know what you are buying.",
      },
    ],
    serviceSlugs: [
      "technical-support",
      "smarthome-consulting-integration",
      "woocommerce-payment-integration",
      "shopify-payment-integration",
    ],
    contactService: "technical-support",
    iconSrc: "/images/services/smarthome.svg",
    iconAlt: "Digital solutions icon",
    examples: ["Websites", "E-commerce support", "Smarthome advice"],
  },
];

export function getServicePillar(slug: string): ServicePillar | undefined {
  return servicePillars.find((pillar) => pillar.slug === slug);
}

export function getPillarServices(pillar: ServicePillar) {
  return pillar.serviceSlugs
    .map((slug) => getService(slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
}
