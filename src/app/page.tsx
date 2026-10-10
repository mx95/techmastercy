import Image from "next/image";
import Link from "next/link";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { PetPalCard } from "@/components/site/PetPalCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { ProductCard } from "@/components/shop/ProductCard";
import { ServiceSelector } from "@/components/services/ServiceSelector";
import { siteFaqs } from "@/content/faqs";
import { getServicesByCategory, services } from "@/content/services";
import { siteConfig } from "@/lib/config";
import { listPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Payment integration & reliable business systems in Cyprus",
  description: siteConfig.description,
  path: "/",
});

const processSteps = [
  {
    title: "Discovery",
    body: "Share your platform, payment provider and the outcome you need. We clarify constraints before writing code.",
  },
  {
    title: "Scoped proposal",
    body: "You receive a practical plan with deliverables and an indicative or fixed estimate—no vague retainers by default.",
  },
  {
    title: "Implement & verify",
    body: "Checkout, callbacks and order updates are built and tested for success, decline, duplicate and delayed events.",
  },
  {
    title: "Handover",
    body: "You get operational notes so your team can support the flow after go-live.",
  },
];

const capabilities = [
  "Online payment gateway integration",
  "JCC payment workflows (with your merchant access)",
  "WooCommerce and Shopify payment setups",
  "Custom website and application payments",
  "REST APIs, webhooks and third-party integrations",
  "Java, Spring Boot, .NET, SQL and backend work",
  "Payment failure and order sync troubleshooting",
  "Practical AI implementation and business automation",
];

const aiPaths = [
  {
    title: "Discover where AI can help",
    body: "Assess one real workflow and get written recommendations before you commit to implementation.",
    href: "/services/ai-consulting-implementation",
  },
  {
    title: "Automate a repetitive business process",
    body: "Connect systems, reduce copy-paste work and keep human review where exceptions matter.",
    href: "/services/business-process-automation",
  },
  {
    title: "Integrate AI into an existing system",
    body: "Wire approved models or tools into websites and applications with logging and access controls.",
    href: "/services/ai-automation",
  },
];

export default async function HomePage() {
  const products = await listPublishedProducts({ sort: "relevance" });
  const featured = products.slice(0, 4);
  const paymentHighlights = services.filter((s) => s.category === "payments").slice(0, 4);
  const aiHighlights = getServicesByCategory("ai-automation").slice(0, 4);

  return (
    <>
      <section className="hero-atmosphere relative overflow-hidden border-b border-white/10">
        <Container className="relative grid min-h-[78vh] items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div>
            <p className="animate-fade-up font-display text-sm font-semibold uppercase tracking-[0.22em] text-accent-soft">
              TechmasterCY
            </p>
            <div className="animate-accent-line mt-4 h-px w-24 origin-left bg-accent" />
            <h1 className="animate-fade-up delay-1 mt-6 max-w-xl text-balance font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              Payment integration that keeps orders and money in sync.
            </h1>
            <p className="animate-fade-up delay-2 mt-5 max-w-lg text-lg text-foreground-muted">
              Specialist help for Cyprus businesses that need reliable online payments,
              webhook-safe backends and practical developer tooling—not another generic agency brochure.
            </p>
            <div className="animate-fade-up delay-3 mt-8 flex flex-wrap gap-3">
              <Button href="/contact?service=payment-gateway-integration" size="lg">
                Request a Payment Integration
              </Button>
              <Button href="/shop" variant="secondary" size="lg">
                Explore the Shop
              </Button>
            </div>
          </div>
          <div className="animate-fade-in delay-2 relative hidden min-h-[320px] lg:block">
            <div className="absolute inset-0 rounded-lg border border-white/10 bg-background-elevated/70 p-8 backdrop-blur-sm">
              <Image
                src="/images/brand/logo-transparent.png"
                alt="TechmasterCY"
                width={420}
                height={120}
                className="h-auto w-full max-w-md"
                priority
              />
              <ul className="mt-10 space-y-3 text-sm text-foreground-muted">
                <li className="flex gap-2">
                  <span className="text-accent">▸</span> Server-validated checkout totals
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">▸</span> Idempotent payment notifications
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">▸</span> WooCommerce, Shopify and custom apps
                </li>
                <li className="flex gap-2">
                  <span className="text-accent">▸</span> Cyprus-focused EUR commerce
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="What we help you ship"
            description="Focused engagements around payments, integrations, AI adoption and the systems that keep them honest."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...paymentHighlights, ...aiHighlights].slice(0, 8).map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="surface group rounded-lg p-5 transition hover:border-accent/40 hover:bg-accent-dim/40"
              >
                <h3 className="font-display text-base font-semibold text-white group-hover:text-accent-soft">
                  {service.shortTitle}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                  {service.summary}
                </p>
              </Link>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/services" variant="secondary">
              View all services
            </Button>
            <Button href="/services/ai-automation" variant="ghost">
              AI & automation hub
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="AI & automation"
            title="Make AI useful for your business."
            description="TechmasterCY helps businesses move from experimenting with AI tools to implementing reliable, measurable solutions in their real workflows—without promising perfect accuracy or replacing every human check."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {aiPaths.map((path, index) => (
              <Link
                key={path.href}
                href={path.href}
                className="surface group rounded-lg p-6 transition hover:border-accent/40"
              >
                <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                  Path 0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-white group-hover:text-accent-soft">
                  {path.title}
                </h3>
                <p className="mt-2 text-sm text-foreground-muted">{path.body}</p>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container className="max-w-4xl">
          <ServiceSelector />
        </Container>
      </section>

      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Capabilities"
            title="Payment integration capabilities"
            description="Work is scoped to real systems: gateways, storefronts, APIs and the failure paths that usually get skipped."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {capabilities.map((item) => (
              <li
                key={item}
                className="surface rounded-lg px-4 py-3 text-sm text-foreground-muted"
              >
                <span className="mr-2 text-accent">●</span>
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Shop"
            title="Featured products"
            description="Hardware from the TechmasterCY catalogue, with server-validated EUR pricing. Digital kits stay unpublished until files are ready."
          />
          {featured.length === 0 ? (
            <p className="mt-8 text-foreground-muted">No published products yet.</p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="mt-8">
            <Button href="/shop" variant="secondary">
              Open the shop
            </Button>
          </div>
          <div className="mt-10">
            <PetPalCard />
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container>
          <SectionHeading
            eyebrow="Engagement"
            title="A clear process from enquiry to handover"
            description="No fabricated case studies—just a repeatable way to reduce payment and integration risk."
          />
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, index) => (
              <li key={step.title} className="surface rounded-lg p-5">
                <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  0{index + 1}
                </p>
                <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-foreground-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container className="grid gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Trust"
            title="Built around verifiable technical practice"
            description="We do not invent client logos, certifications, review scores or years of experience. Trust comes from how the work is done."
          />
          <ul className="space-y-4 text-sm text-foreground-muted">
            <li className="surface rounded-lg p-4">
              Prices, stock and licence options are validated on the server—never trusted from the browser.
            </li>
            <li className="surface rounded-lg p-4">
              Payment success is confirmed through provider verification and idempotent notifications, not a thank-you page redirect.
            </li>
            <li className="surface rounded-lg p-4">
              JCC work uses your merchant documentation and credentials. No unofficial API behaviour is assumed.
            </li>
            <li className="surface rounded-lg p-4">
              Digital downloads are issued only after a paid order is verified, with expiring access tokens.
            </li>
          </ul>
        </Container>
      </section>

      <section className="border-b border-white/10 py-16 lg:py-20">
        <Container>
          <SectionHeading eyebrow="FAQ" title="Common questions" />
          <div className="mt-8 max-w-3xl">
            <FaqAccordion items={siteFaqs} />
          </div>
        </Container>
      </section>

      <section className="py-16 lg:py-20">
        <Container className="surface overflow-hidden rounded-xl px-6 py-10 sm:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white">
              Ready to fix payment flow—or start a clean integration?
            </h2>
            <p className="mt-3 text-foreground-muted">
              Tell us about your store or application. You will get a scoped reply, not an automated sales sequence.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="/contact" size="lg">
                Request a quote
              </Button>
              <Button href={`mailto:${siteConfig.businessEmail}`} variant="secondary" size="lg">
                Email {siteConfig.businessEmail}
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
