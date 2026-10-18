import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteConfig } from "@/lib/config";
import { listPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Tech help for Cyprus businesses | AI, payments, websites",
  description:
    "TechmasterCY helps Cyprus businesses fix payments, set up practical AI, support websites, and plan smarthome setups—plus a small shop including PetPal GPS trackers.",
  path: "/",
});

const offers = [
  {
    title: "Get AI into real work—not another unused tool",
    body: "I help you pick the right AI approach, wire it into your workflows, and keep humans in control where it matters.",
    href: "/services/ai-consulting-implementation",
    label: "Explore AI setup",
    outcome: "Clear plan + working setup",
  },
  {
    title: "Make online payments reliable end to end",
    body: "Checkout, callbacks and order status stay aligned—so customers pay once and you know it worked.",
    href: "/services/payment-gateway-integration",
    label: "Fix payments",
    outcome: "Fewer failed or stuck payments",
  },
  {
    title: "Get calm help when the website or API breaks",
    body: "Scoped remote support for sites, deployments and everyday technical issues—business hours, clear findings, no fog.",
    href: "/services/technical-support",
    label: "Get website support",
    outcome: "Faster answers, less downtime",
  },
  {
    title: "Connect cameras, hubs and finders that actually work together",
    body: "Practical smarthome consulting for homes and small businesses—plan first, then integrate cleanly.",
    href: "/services/smarthome-consulting-integration",
    label: "Plan smarthome",
    outcome: "A setup you can run day to day",
  },
];

const steps = [
  {
    title: "Tell me the problem",
    body: "A short note about your systems and what “done” looks like is enough to start.",
  },
  {
    title: "Get a clear scope",
    body: "You receive a plain-language plan: what’s included, what’s not, and an estimate.",
  },
  {
    title: "Ship and hand over",
    body: "We implement, test, and leave you with notes you can actually use.",
  },
];

export default async function HomePage() {
  const products = await listPublishedProducts({ sort: "relevance" });

  return (
    <>
      <section className="hero-atmosphere relative overflow-hidden border-b border-white/10">
        <Container className="relative py-14 sm:py-16 lg:py-24">
          <p className="animate-fade-up font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-soft">
            TechmasterCY
          </p>
          <div className="animate-accent-line mt-4 h-px w-16 origin-left bg-accent delay-1" />
          <h1 className="animate-fade-up delay-1 mt-5 max-w-3xl text-balance font-display text-[2.1rem] font-semibold leading-[1.08] text-white sm:text-5xl lg:text-6xl">
            Tech that works for your business in Cyprus
          </h1>
          <p className="animate-fade-up delay-2 mt-5 max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            Stuck payments, unused AI tools, fragile websites, messy smarthome gear—I help you fix
            the thing that’s costing you time, then hand it back with clear notes.
          </p>
          <div className="animate-fade-up delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" size="lg" className="w-full sm:w-auto">
              Tell me what you need
            </Button>
            <Button href="#services" variant="secondary" size="lg" className="w-full sm:w-auto">
              See how I can help
            </Button>
          </div>
          <p className="animate-fade-in delay-3 mt-6 max-w-xl text-sm text-foreground-muted">
            Cyprus-based · clear scope before work · human reply, not a sales drip
          </p>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-18" id="services">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Problems I help Cyprus businesses solve"
            description="Pick the outcome you need. Each page explains the scope; you get a quote before anything starts."
          />
          <ol className="mt-10 space-y-0 divide-y divide-white/10 border-y border-white/10">
            {offers.map((offer, index) => (
              <li key={offer.href} className="animate-fade-up" style={{ animationDelay: `${0.08 * index}s` }}>
                <Link
                  href={offer.href}
                  className="group flex flex-col gap-3 py-7 transition sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
                >
                  <span className="font-display text-sm font-semibold tabular-nums text-accent-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent-soft/80">
                      {offer.outcome}
                    </p>
                    <h2 className="mt-1 font-display text-xl font-semibold text-white group-hover:text-accent-soft sm:text-2xl">
                      {offer.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground-muted sm:text-base">
                      {offer.body}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-accent-soft opacity-90 group-hover:opacity-100">
                    {offer.label} →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-foreground-muted">
              Prefer email?{" "}
              <a
                href={`mailto:${siteConfig.businessEmail}`}
                className="font-medium text-accent-soft hover:underline"
              >
                {siteConfig.businessEmail}
              </a>
            </p>
            <Button href="/contact" size="md" className="w-full sm:w-auto">
              Request a scoped quote
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="how-it-works">
        <Container>
          <SectionHeading
            eyebrow="How it works"
            title="Simple on purpose"
            description="No jargon theatre. You always know the next step and what it costs."
          />
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title} className="relative">
                <p className="font-display text-sm font-semibold tabular-nums text-accent-soft">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted sm:text-base">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="shop">
        <Container>
          <SectionHeading
            eyebrow="Shop"
            title="Useful tech you can buy today"
            description="AirTag finders and car tech checkout here. PetPal GPS trackers open petpal.com.cy—same builder, separate shop."
          />
          {products.length === 0 ? (
            <p className="mt-8 text-foreground-muted">No products published yet.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href="/shop" variant="secondary">
              View full shop
            </Button>
            <Button
              href="https://petpal.com.cy/shop"
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open PetPal shop →
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-16">
        <Container className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[#152033] via-[#111827] to-[#0b1220] px-6 py-10 sm:px-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.14),transparent_55%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Ready when you are
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
              Send a short message about your systems and the outcome you want. You’ll get a
              scoped reply—usually within one business day—not an automated sales sequence.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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
        </Container>
      </section>
    </>
  );
}
