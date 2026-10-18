import Link from "next/link";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteConfig } from "@/lib/config";
import { listPublishedProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "AI, payments, websites & smarthome | Cyprus",
  description:
    "TechmasterCY helps Cyprus businesses with AI setup, payment integrations, website support, and smarthome consulting—plus a small hardware shop.",
  path: "/",
});

const offers = [
  {
    title: "AI consulting and setup",
    body: "Help companies choose, set up and connect AI tools to real workflows—with clear scope, logging and human review where it matters.",
    href: "/services/ai-consulting-implementation",
    label: "AI consulting",
  },
  {
    title: "Web page integration with payment systems",
    body: "Connect your site or app to online payments so checkout, callbacks and order status stay aligned.",
    href: "/services/payment-gateway-integration",
    label: "Payment integration",
  },
  {
    title: "Website general support",
    body: "Scoped remote help for websites, APIs, deployments and everyday technical issues—business hours, clear findings.",
    href: "/services/technical-support",
    label: "Website support",
  },
  {
    title: "Smarthome consulting and integration",
    body: "Plan and integrate smart-home setups—cameras, hubs, finders and related systems—with practical advice for homes and small businesses.",
    href: "/services/smarthome-consulting-integration",
    label: "Smarthome",
  },
];

export default async function HomePage() {
  const products = await listPublishedProducts({ sort: "relevance" });

  return (
    <>
      <section className="hero-atmosphere relative overflow-hidden border-b border-white/10">
        <Container className="relative py-12 sm:py-16 lg:py-20">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-accent-soft">
            TechmasterCY
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[2rem] font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            What I can do for your business
          </h1>
          <p className="mt-4 max-w-xl text-base text-foreground-muted sm:mt-5 sm:text-lg">
            Practical AI setup, payment integrations, website support and smarthome
            consulting for Cyprus—plus a small shop of useful tech.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button href="/contact" size="lg" className="w-full sm:w-auto">
              Discuss a project
            </Button>
            <Button href="#shop" variant="secondary" size="lg" className="w-full sm:w-auto">
              Browse the shop
            </Button>
          </div>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-18" id="services">
        <Container>
          <SectionHeading
            eyebrow="Services"
            title="Four things I offer"
            description="Pick what you need. Each page explains the scope; contact me for a quote."
          />
          <ol className="mt-10 space-y-0 divide-y divide-white/10 border-y border-white/10">
            {offers.map((offer, index) => (
              <li key={offer.href}>
                <Link
                  href={offer.href}
                  className="group flex flex-col gap-3 py-7 transition sm:flex-row sm:items-baseline sm:gap-8 sm:py-8"
                >
                  <span className="font-display text-sm font-semibold tabular-nums text-accent-soft">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-xl font-semibold text-white group-hover:text-accent-soft sm:text-2xl">
                      {offer.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-foreground-muted sm:text-base">
                      {offer.body}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-accent-soft opacity-80 group-hover:opacity-100">
                    {offer.label} →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="mt-8 text-sm text-foreground-muted">
            Prefer email?{" "}
            <a
              href={`mailto:${siteConfig.businessEmail}`}
              className="font-medium text-accent-soft hover:underline"
            >
              {siteConfig.businessEmail}
            </a>
          </p>
        </Container>
      </section>

      <section className="border-b border-white/10 py-14 lg:py-16" id="shop">
        <Container>
          <SectionHeading
            eyebrow="Shop"
            title="Hardware and kits"
            description="Buy published catalogue items with server-validated checkout. Pack prices apply where shown."
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
        <Container className="surface rounded-xl px-6 py-10 sm:px-10">
          <h2 className="font-display text-3xl font-semibold text-white">
            Tell me what you need
          </h2>
          <p className="mt-3 max-w-2xl text-foreground-muted">
            Share your systems and the outcome you want. You get a scoped reply—not an
            automated sales sequence.
          </p>
          <div className="mt-6">
            <Button href="/contact" size="lg">
              Contact TechmasterCY
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
