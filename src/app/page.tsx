import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  ServiceOfferCard,
  type ServiceOffer,
} from "@/components/site/ServiceOfferCard";
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

const offers: ServiceOffer[] = [
  {
    name: "AI consulting & setup",
    summary: "Put AI into real workflows",
    detail:
      "Choose tools, connect them to your process, and keep human review where it matters—so AI helps staff instead of sitting unused.",
    href: "/services/ai-consulting-implementation",
    label: "Explore AI setup",
    iconSrc: "/images/services/ai.svg",
    iconAlt: "AI consulting icon",
  },
  {
    name: "Payment web integrations",
    summary: "Checkout that stays reliable",
    detail:
      "Connect your site or app to payment systems so customers pay once and order status matches what actually happened.",
    href: "/services/payment-gateway-integration",
    label: "Fix payments",
    iconSrc: "/images/services/payments.svg",
    iconAlt: "Payment integration icon",
  },
  {
    name: "Website general support",
    summary: "Help when things break",
    detail:
      "Scoped remote help for websites, APIs and deployments—business hours, clear findings, no vague retainers.",
    href: "/services/technical-support",
    label: "Get support",
    iconSrc: "/images/services/website-support.svg",
    iconAlt: "Website support icon",
  },
  {
    name: "Smarthome consulting",
    summary: "Devices that work together",
    detail:
      "Plan and integrate cameras, hubs, finders and related systems for homes and small businesses in Cyprus.",
    href: "/services/smarthome-consulting-integration",
    label: "Plan smarthome",
    iconSrc: "/images/services/smarthome.svg",
    iconAlt: "Smarthome consulting icon",
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
            Four clear ways I can help your business
          </h1>
          <p className="animate-fade-up delay-2 mt-5 max-w-xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            AI setup, payment integrations, website support and smarthome consulting for Cyprus—plus
            a small shop of useful trackers and car tech.
          </p>
          <div className="animate-fade-up delay-3 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="#services" size="lg" className="w-full sm:w-auto">
              See what I offer
            </Button>
            <Button href="/contact" variant="secondary" size="lg" className="w-full sm:w-auto">
              Tell me what you need
            </Button>
          </div>
          <p className="animate-fade-in delay-3 mt-6 max-w-xl text-sm text-foreground-muted">
            Cyprus-based · clear scope before work · human reply, not a sales drip
          </p>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="services">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="What I can offer"
            description="Each box is one service. Tap for scope details, then ask for a quote."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {offers.map((offer) => (
              <ServiceOfferCard key={offer.href} offer={offer} />
            ))}
          </div>
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
              <li key={step.title}>
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
            title="Hardware you can buy today"
            description="AirTag finders checkout here. The PetPal GPS collar tracker opens petpal.com.cy to buy."
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
