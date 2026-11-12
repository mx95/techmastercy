import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  ApiDiagram,
  AutomationDiagram,
  PaymentFlowDiagram,
  WebhookDiagram,
} from "@/components/site/TechDiagrams";
import { servicePillars } from "@/content/service-pillars";
import { siteConfig } from "@/lib/config";
import { listPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Payments and technology, made simpler",
  description:
    "TechmasterCY helps businesses integrate payment systems, connect applications and automate work that slows them down—from Cyprus to international projects.",
  path: "/",
});

const paymentExamples = [
  { label: "JCC payment integration", href: "/services/jcc-payment-integration" },
  { label: "Payment gateway integrations", href: "/services/payment-gateway-integration" },
  { label: "3-D Secure (3DS) flows", href: "/services/payment-solutions" },
  { label: "Apple Pay & Google Pay", href: "/services/payment-solutions" },
  { label: "Webhook implementation", href: "/services/api-webhook-integration" },
  { label: "Payment troubleshooting", href: "/services/payment-troubleshooting" },
];

const otherServices = servicePillars
  .filter((pillar) => !pillar.featured)
  .map((pillar) => ({
    title: pillar.title,
    problem:
      pillar.id === "software-api-development"
        ? "Your systems need to exchange data reliably, or a custom backend has to fill a gap products cannot."
        : pillar.id === "ai-business-automation"
          ? "Teams repeat the same manual steps, or AI tools sit unused without clear guardrails."
          : "Websites, shops or devices need practical help without an open-ended retainer.",
    help: pillar.summary,
    detail: pillar.description,
    href: `/services/${pillar.slug}`,
    examples: pillar.examples,
    iconSrc: pillar.iconSrc,
  }));

const trustPoints = [
  {
    title: "Server-side payment verification",
    body: "Paid status is confirmed on the server—not only from a browser thank-you page.",
  },
  {
    title: "Reliable webhook handling",
    body: "Callbacks are verified, deduplicated and reconciled so retries do not create chaos.",
  },
  {
    title: "Secure API communication",
    body: "Integrations follow authenticated contracts and respect provider documentation.",
  },
  {
    title: "Proper failure handling",
    body: "Declines, timeouts and partial states are designed in—not discovered in production.",
  },
  {
    title: "Documented implementations",
    body: "Operators receive notes they can use after handover.",
  },
  {
    title: "Clear project scope",
    body: "Inclusions, exclusions and estimates are agreed before work starts.",
  },
];

const steps = [
  { title: "Understand", body: "We discuss your requirements and challenges." },
  { title: "Plan", body: "We define the solution and project scope." },
  { title: "Build", body: "We implement and test the solution." },
  { title: "Support", body: "We assist after delivery according to the agreed scope." },
];

export default async function HomePage() {
  const products = await listPublishedProducts({ sort: "relevance" });
  const paymentPillar = servicePillars.find((p) => p.featured)!;

  return (
    <>
      <section className="hero-atmosphere relative overflow-hidden border-b border-white/10">
        <Container className="relative grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div>
            <p className="animate-fade-up font-display text-sm font-semibold uppercase tracking-[0.22em] text-accent-soft">
              TechmasterCY
            </p>
            <div className="animate-accent-line mt-4 h-px w-16 origin-left bg-accent delay-1" />
            <h1 className="animate-fade-up delay-1 mt-6 max-w-3xl text-balance font-display text-[2.15rem] font-semibold leading-[1.05] text-white sm:text-5xl lg:text-[3.25rem]">
              Payments and technology, made simpler.
            </h1>
            <p className="animate-fade-up delay-2 mt-5 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
              We help businesses integrate payment systems, connect their applications and automate
              the work that slows them down.
            </p>
            <div className="animate-fade-up delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/contact" size="lg" className="w-full sm:w-auto">
                Let’s discuss your project
              </Button>
              <Button
                href="/services/payment-solutions"
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore payment solutions
              </Button>
            </div>
          </div>
          <div className="animate-fade-in delay-2 hidden lg:block">
            <PaymentFlowDiagram />
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="payment-solutions">
        <Container>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
            Flagship service
          </p>
          <div className="mt-3 grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                {paymentPillar.title}
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
                <span className="text-foreground">The problem: </span>
                Checkout looks fine to customers, but orders stay stuck, callbacks fail, or nobody
                trusts whether a payment actually completed.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
                <span className="text-foreground">How we help: </span>
                {paymentPillar.summary} TechmasterCY scopes the provider, implements the flow against
                official documentation, and leaves operators with a clear path after go-live.
              </p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {paymentExamples.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="block rounded-md border border-white/10 bg-background-elevated/50 px-4 py-3 text-sm text-foreground transition hover:border-accent/40 hover:text-accent-soft"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/services/payment-solutions" size="lg" className="w-full sm:w-auto">
                  View payment solutions
                </Button>
                <Button
                  href="/contact?service=payment-gateway-integration"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Discuss a payment project
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <PaymentFlowDiagram />
              <WebhookDiagram />
              <p className="text-xs text-foreground-muted">
                Apple Pay, Google Pay and 3DS depend on the provider and merchant account—confirmed
                before they are promised.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="services">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Other ways we help"
            description="After payments, TechmasterCY also builds software, automates workflows and supports digital systems—scoped clearly for business owners and technical teams."
          />
          <div className="mt-10 space-y-10">
            {otherServices.map((service, index) => (
              <article
                key={service.href}
                className="grid gap-6 border-b border-white/10 pb-10 last:border-0 last:pb-0 lg:grid-cols-[1fr_0.85fr] lg:items-center"
              >
                <div>
                  <div className="flex items-start gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.iconSrc}
                      alt=""
                      width={56}
                      height={56}
                      className="h-14 w-14 shrink-0"
                    />
                    <div>
                      <p className="font-display text-sm font-semibold tabular-nums text-accent-soft">
                        {String(index + 2).padStart(2, "0")}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-semibold text-white">
                        {service.title}
                      </h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-foreground-muted sm:text-base">
                    <span className="font-medium text-foreground">The problem: </span>
                    {service.problem}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted sm:text-base">
                    <span className="font-medium text-foreground">How we help: </span>
                    {service.help}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                    {service.detail}
                  </p>
                  {service.examples?.length ? (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {service.examples.map((example) => (
                        <li
                          key={example}
                          className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-foreground-muted"
                        >
                          {example}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <Button href={service.href} className="mt-6">
                    Learn more
                  </Button>
                </div>
                <div className="hidden sm:block">
                  {index === 0 ? <ApiDiagram /> : null}
                  {index === 1 ? <AutomationDiagram /> : null}
                  {index === 2 ? (
                    <div className="rounded-xl border border-white/10 bg-[#0a101c] p-5 text-sm leading-relaxed text-foreground-muted">
                      Websites, e-commerce support and smart technology advice—kept secondary to
                      payment and software engineering.
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="practical-engineering">
        <Container>
          <SectionHeading
            eyebrow="Trust"
            title="Practical engineering, not just integrations"
            description="Factual delivery habits that keep payment and software work dependable."
          />
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {trustPoints.map((point) => (
              <li key={point.title}>
                <h3 className="font-display text-lg font-semibold text-white">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{point.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="how-we-work">
        <Container>
          <SectionHeading
            eyebrow="How we work"
            title="A simple four-step process"
            description="You always know what happens next."
          />
          <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title}>
                <p className="font-display text-sm font-semibold tabular-nums text-accent-soft">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted sm:text-base">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-white/10 py-12 lg:py-14" id="shop">
        <Container>
          <div className="rounded-xl border border-dashed border-white/15 bg-background-elevated/30 px-5 py-8 sm:px-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground-muted">
                  Product shop
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-white">
                  Hardware catalogue
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                  Separate from professional services. A small selection of technology products.
                  PetPal GPS checkouts on petpal.com.cy with its own branding and payments.
                </p>
              </div>
              <Button href="/shop" variant="secondary" className="w-full shrink-0 sm:w-auto">
                Browse the shop
              </Button>
            </div>
            {products.length > 0 ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {products.slice(0, 3).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-16">
        <Container>
          <div className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#152033] via-[#111827] to-[#0b1220] px-6 py-12 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.14),transparent_55%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                Not sure which solution you need?
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
                Tell us about your challenge. We will help you work out the next step—whether you
                are a business owner or a software agency.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" size="lg" className="w-full sm:w-auto">
                  Start a conversation
                </Button>
                <Button
                  href={`mailto:${siteConfig.businessEmail}`}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Email {siteConfig.businessEmail}
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
