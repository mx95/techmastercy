import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  ServiceOfferCard,
  type ServiceOffer,
} from "@/components/site/ServiceOfferCard";
import { servicePillars } from "@/content/service-pillars";
import { siteConfig } from "@/lib/config";
import { listPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Technology & software engineering for businesses",
  description:
    "TechmasterCY helps businesses integrate payments, build software and APIs, and improve digital solutions—from Cyprus to international projects.",
  path: "/",
});

const offers: ServiceOffer[] = servicePillars.map((pillar) => ({
  name: pillar.title,
  summary: pillar.summary,
  detail: pillar.description,
  href: `/services/${pillar.slug}`,
  label: "Learn more",
  iconSrc: pillar.iconSrc,
  iconAlt: pillar.iconAlt,
  examples: pillar.examples,
  featured: pillar.featured,
}));

const expertise = [
  {
    title: "Payment integrations",
    body: "Gateways, webhooks and checkout flows that keep order status honest.",
  },
  {
    title: "API & backend development",
    body: "REST services, integrations and systems that fit how your teams work.",
  },
  {
    title: "Business automation",
    body: "Practical AI and workflow automation with clear human oversight.",
  },
  {
    title: "Custom digital solutions",
    body: "Websites, e-commerce support and technology consulting when you need them.",
  },
];

const reasons = [
  {
    title: "Direct technical communication",
    body: "You talk with someone who can discuss systems, not a hand-off sales script.",
  },
  {
    title: "Solutions tailored to your requirements",
    body: "Scope follows your platforms and constraints—not a one-size package.",
  },
  {
    title: "Clear project scope",
    body: "Inclusions, exclusions and estimates before work starts.",
  },
  {
    title: "Practical implementation",
    body: "Server-side verification, tested paths and notes operators can use.",
  },
  {
    title: "Support beyond initial delivery",
    body: "Follow-up help according to the agreed scope—not an open-ended promise.",
  },
];

const steps = [
  {
    title: "Understand",
    body: "We discuss your requirements and challenges.",
  },
  {
    title: "Plan",
    body: "We define the solution and project scope.",
  },
  {
    title: "Build",
    body: "We implement and test the solution.",
  },
  {
    title: "Support",
    body: "We assist after delivery according to the agreed scope.",
  },
];

export default async function HomePage() {
  const products = await listPublishedProducts({ sort: "relevance" });

  return (
    <>
      <section className="hero-atmosphere relative overflow-hidden border-b border-white/10">
        <Container className="relative py-16 sm:py-20 lg:py-28">
          <p className="animate-fade-up font-display text-sm font-semibold uppercase tracking-[0.22em] text-accent-soft">
            TechmasterCY
          </p>
          <div className="animate-accent-line mt-4 h-px w-16 origin-left bg-accent delay-1" />
          <h1 className="animate-fade-up delay-1 mt-6 max-w-3xl text-balance font-display text-[2.15rem] font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Technology that moves your business forward.
          </h1>
          <p className="animate-fade-up delay-2 mt-5 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
            From secure payment integrations to custom software and intelligent automation,
            TechmasterCY helps businesses build reliable digital solutions without unnecessary
            complexity.
          </p>
          <div className="animate-fade-up delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" size="lg" className="w-full sm:w-auto">
              Let’s discuss your project
            </Button>
            <Button href="#services" variant="secondary" size="lg" className="w-full sm:w-auto">
              Explore our services
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="expertise">
        <Container>
          <SectionHeading
            eyebrow="Expertise"
            title="What we help businesses do"
            description="A technology and software engineering company helping you integrate, build and improve digital solutions."
          />
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {expertise.map((item) => (
              <li key={item.title}>
                <h3 className="font-display text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{item.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="services">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Four clear areas of work"
            description="Payment Solutions is the primary specialist focus. The other areas support complete digital delivery."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {offers.map((offer) => (
              <ServiceOfferCard key={offer.href} offer={offer} />
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="why">
        <Container>
          <SectionHeading
            eyebrow="Why TechmasterCY"
            title="Reasons customers get in touch"
            description="Approachable technical help with transparent scope—without brochure claims."
          />
          <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <li key={reason.title}>
                <h3 className="font-display text-lg font-semibold text-white">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                  {reason.body}
                </p>
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

      <section className="border-b border-white/10 py-14 lg:py-16" id="featured">
        <Container>
          <SectionHeading
            eyebrow="Featured"
            title="Start with payments or software"
            description="If you are unsure where you fit, these two paths cover most project enquiries."
          />
          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">
                Payment Solutions
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted sm:text-base">
                Gateway integrations, webhooks, storefront payments and troubleshooting for Cyprus
                and international merchants.
              </p>
              <Button href="/services/payment-solutions" className="mt-6">
                Explore payment solutions
              </Button>
            </div>
            <div>
              <h3 className="font-display text-2xl font-semibold text-white">
                Software & API Development
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted sm:text-base">
                Custom backends, REST APIs and system integrations when products alone are not
                enough.
              </p>
              <Button href="/services/software-api-development" className="mt-6">
                Explore software & APIs
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="shop">
        <Container>
          <SectionHeading
            eyebrow="Shop"
            title="Selected hardware"
            description="A small catalogue of useful products. PetPal GPS checkouts on petpal.com.cy."
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
          <div className="mt-10">
            <Button href="/shop" variant="secondary">
              View full shop
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-14 lg:py-16">
        <Container>
          <div className="relative overflow-hidden border border-white/10 bg-gradient-to-br from-[#152033] via-[#111827] to-[#0b1220] px-6 py-12 sm:px-10">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(34,211,238,0.14),transparent_55%)]" />
            <div className="relative">
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
                Have a project in mind?
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted sm:text-lg">
                Tell us what you’re trying to achieve. We’ll discuss your requirements and help you
                identify the right approach.
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
