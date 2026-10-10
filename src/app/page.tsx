import Link from "next/link";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { PaymentProvidersSection } from "@/components/site/PaymentProvidersSection";
import { PetPalCard } from "@/components/site/PetPalCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

const heroHighlights = [
  {
    title: "Online payments & integrations",
    body: "Gateway checkout, callbacks and order status that stay aligned.",
  },
  {
    title: "APIs, webhooks & reliability",
    body: "Server-side verification, idempotency and clearer failure handling.",
  },
  {
    title: "AI & business automation",
    body: "Practical workflows with logging, access control and human review.",
  },
];

export const metadata = createMetadata({
  title: "Payment integration services Cyprus | Automation & AI",
  description:
    "Reliable payment gateway integration, API and business process automation, and practical AI implementation for businesses in Cyprus. Clear scope, testing and handover.",
  path: "/",
});

const problemServices = [
  {
    problem: "Online payments that fail or stay pending",
    outcome: "Checkout, callbacks and order status stay aligned after each payment attempt.",
    href: "/services/payment-gateway-integration",
    label: "Payment gateway integration",
  },
  {
    problem: "JCC or local payment workflows that need hardening",
    outcome: "Server-side sessions, verified notifications and idempotent paid/failed handling.",
    href: "/services/jcc-payment-integration",
    label: "JCC payment integration",
  },
  {
    problem: "Repetitive admin between systems",
    outcome: "Connect storefronts, CRMs and spreadsheets so staff stop copy-pasting orders and reports.",
    href: "/services/business-process-automation",
    label: "Business process automation",
  },
  {
    problem: "AI experiments that never reach production",
    outcome: "Assess one workflow, then implement with logging, access control and human review where it matters.",
    href: "/services/ai-consulting-implementation",
    label: "AI consulting & implementation",
  },
  {
    problem: "Website, API or webhook issues with no in-house specialist",
    outcome: "Scoped remote investigation during business hours—clear findings, no unlimited 24/7 claims.",
    href: "/services/technical-support",
    label: "Technical support",
  },
  {
    problem: "WooCommerce or Shopify payment setup",
    outcome: "Configure and verify store checkout so successful payments update orders correctly.",
    href: "/services/woocommerce-payment-integration",
    label: "Store payment integrations",
  },
];

const processSteps = [
  {
    title: "Discovery",
    body: "You describe the platform, payment provider or workflow and the outcome you need.",
  },
  {
    title: "Scoped proposal",
    body: "You get deliverables, exclusions and an indicative or fixed estimate before coding starts.",
  },
  {
    title: "Implement & verify",
    body: "Work is built and tested for success, decline, duplicate and delayed cases where relevant.",
  },
  {
    title: "Handover",
    body: "You receive operational notes so your team can support the flow after go-live.",
  },
];

const useCases = [
  {
    title: "Payment checkout that updates orders",
    items: [
      "Server-validated totals and licence options",
      "Provider notification verification",
      "Clear paid / failed / cancelled states",
    ],
  },
  {
    title: "Automation that removes copy-paste",
    items: [
      "Order or enquiry routing between systems",
      "Invoice and appointment notifications",
      "Imports, exports and recurring reports",
    ],
  },
  {
    title: "Practical AI in one defined workflow",
    items: [
      "Document extraction from approved sources",
      "Support drafts with human approval",
      "Internal assistants limited to approved documents",
    ],
  },
];

const trustFacts = [
  "Prices and licence options in the shop are validated on the server—never trusted from the browser.",
  "Payment success is confirmed through provider verification and idempotent notifications, not a thank-you page redirect.",
  "JCC work uses your merchant documentation and credentials. No official partnership or certification is claimed.",
  "AI integrations are opt-in per project. Customer data is not sent to third-party AI services without appropriate authorization.",
  "Support packages have a limited allowance and business-hour expectations—not unlimited or 24/7 coverage.",
];

export default function HomePage() {
  return (
    <>
      {/* 1. Value proposition */}
      <section className="hero-atmosphere relative overflow-hidden border-b border-white/10">
        <Container className="relative grid min-w-0 items-center gap-8 py-10 sm:gap-10 sm:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-accent-soft">
              TechmasterCY · Cyprus
            </p>
            <h1 className="mt-3 max-w-xl text-balance font-display text-[1.7rem] font-semibold leading-tight text-white sm:mt-4 sm:text-4xl lg:text-5xl">
              Reliable payment integrations and business systems.
            </h1>
            <p className="mt-3 max-w-lg text-sm text-foreground-muted sm:mt-5 sm:text-lg">
              Practical help with online payments, APIs, automation and AI implementation for
              businesses in Cyprus—scoped clearly, tested properly and handed over so your team
              can run it.
            </p>
            <ul className="mt-4 grid gap-2 text-sm text-foreground-muted sm:mt-5 sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
              <li>Payment gateways &amp; troubleshooting</li>
              <li>APIs &amp; webhooks</li>
              <li>Automation &amp; AI</li>
              <li>Scoped technical support</li>
            </ul>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              <Button href="/contact" size="lg" className="w-full sm:w-auto">
                Discuss Your Project
              </Button>
              <Button href="/services" variant="secondary" size="lg" className="w-full sm:w-auto">
                Explore Services
              </Button>
            </div>
            <p className="mt-4 text-sm text-foreground-muted">
              Prefer email?{" "}
              <a
                href={`mailto:${siteConfig.businessEmail}`}
                className="font-medium text-accent-soft hover:underline"
              >
                {siteConfig.businessEmail}
              </a>
            </p>
          </div>
          <div className="relative hidden lg:block">
            <div className="rounded-lg border border-white/10 bg-background-elevated/80 p-7">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">
                What we help with
              </p>
              <ul className="mt-5 space-y-5">
                {heroHighlights.map((item, index) => (
                  <li key={item.title} className="flex gap-3">
                    <span
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-accent/35 bg-accent-dim font-display text-xs font-semibold text-accent-soft"
                      aria-hidden
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="mt-1 text-sm text-foreground-muted">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 border-t border-white/10 pt-4 text-xs text-foreground-muted">
                Merchants, SaaS and ops teams in Cyprus · scoped proposal before build
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Services by customer problem */}
      <section className="border-b border-white/10 py-14 lg:py-16">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="What problem are you trying to solve?"
            description="Pick the closest match. Each service page explains inclusions, process and indicative pricing."
          />
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {problemServices.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="surface group rounded-lg p-5 transition hover:border-accent/40 hover:bg-accent-dim/30"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-soft">
                  {item.label}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold text-white group-hover:text-accent-soft">
                  {item.problem}
                </h3>
                <p className="mt-2 text-sm text-foreground-muted">{item.outcome}</p>
              </Link>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/services" variant="secondary">
              View all services
            </Button>
          </div>
        </Container>
      </section>

      {/* 3. How working together works */}
      <section className="border-b border-white/10 py-14 lg:py-16">
        <Container>
          <SectionHeading
            eyebrow="Process"
            title="How working with TechmasterCY works"
            description="No vague retainers by default—scope first, then delivery."
          />
          <ol className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <li key={step.title} className="surface rounded-lg p-5">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Step {index + 1}
                </p>
                <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 4. Use cases and deliverables */}
      <section className="border-b border-white/10 py-14 lg:py-16">
        <Container>
          <SectionHeading
            eyebrow="Deliverables"
            title="Examples of suitable work"
            description="Concrete outcomes—not vague “AI transformation” claims."
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {useCases.map((block) => (
              <article key={block.title} className="surface rounded-lg p-5">
                <h3 className="font-display text-lg font-semibold text-white">{block.title}</h3>
                <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
                  {block.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-accent" aria-hidden>
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 5. Payment providers */}
      <PaymentProvidersSection />

      {/* 6. Trust — real facts only */}
      <section className="border-b border-white/10 py-14 lg:py-16">
        <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Trust"
            title="How we keep delivery honest"
            description="We do not invent client logos, testimonials, certifications or success metrics. Trust comes from how the work is done."
          />
          <ul className="space-y-3 text-sm text-foreground-muted">
            {trustFacts.map((fact) => (
              <li key={fact} className="surface rounded-lg px-4 py-3">
                {fact}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 7. Contact CTA */}
      <section className="border-b border-white/10 py-14 lg:py-16">
        <Container className="surface rounded-xl px-6 py-10 sm:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              Tell us what is broken—or what you want to ship.
            </h2>
            <p className="mt-3 text-foreground-muted">
              Share your systems and the outcome you need. You receive a scoped reply—not an
              automated sales sequence. Indicative package prices are proposals until confirmed in a
              quote.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/contact" size="lg" className="w-full sm:w-auto">
                Discuss Your Project
              </Button>
              <Button href="/shop" variant="secondary" size="lg" className="w-full sm:w-auto">
                View Digital Products
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* 8. PetPal — own project */}
      <section className="py-10 lg:py-12">
        <Container>
          <PetPalCard />
        </Container>
      </section>
    </>
  );
}
