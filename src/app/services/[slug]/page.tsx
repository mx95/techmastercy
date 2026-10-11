import Link from "next/link";
import { notFound } from "next/navigation";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import { getService, services } from "@/content/services";
import { formatEur } from "@/lib/money";
import {
  breadcrumbJsonLd,
  createMetadata,
  serviceJsonLd,
} from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) {
    return createMetadata({
      title: "Service not found",
      description: "Service unavailable.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }
  const title = /cyprus/i.test(service.title)
    ? service.title
    : `${service.title} Cyprus`;
  return createMetadata({
    title,
    description: `${service.summary} Serving businesses in Cyprus.`,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = services
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  const processSteps = service.process.slice(0, 3);

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
      />
      <header className="mt-6 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">Service</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-white">{service.title}</h1>
        <p className="mt-4 text-lg text-foreground-muted">{service.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={`/contact?service=${service.slug}`}>Request a Quote</Button>
          <Button href="/services" variant="secondary">
            All services
          </Button>
        </div>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="surface rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">The problem</h2>
          <p className="mt-3 text-sm text-foreground-muted">{service.problem}</p>
        </section>
        <section className="surface rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">Who it is for</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
            {service.whoNeeds.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
        <section className="surface rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">What is included</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
            {service.included.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
        <section className="surface rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">Deliverables</h2>
          <ul className="mt-3 space-y-2 text-sm text-foreground-muted">
            {service.deliverables.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8 surface rounded-lg p-6">
        <h2 className="font-display text-xl font-semibold">How it works</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step} className="text-sm text-foreground-muted">
              <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                Step {index + 1}
              </span>
              <p className="mt-2">{step}</p>
            </li>
          ))}
        </ol>
        {service.process.length > 3 ? (
          <p className="mt-4 text-xs text-foreground-muted">
            Further steps in a typical engagement: {service.process.slice(3).join(" · ")}
          </p>
        ) : null}
      </section>

      <section className="mt-8 surface rounded-lg p-6">
        <h2 className="font-display text-xl font-semibold">{service.pricing.label}</h2>
        {service.pricing.fromEur ? (
          <p className="mt-2 text-2xl font-semibold text-accent-soft">
            From {formatEur(service.pricing.fromEur * 100)}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-foreground-muted">{service.pricing.note}</p>
        <ul className="mt-4 space-y-1 text-xs text-foreground-muted">
          <li>• Indicative unless confirmed as a fixed quote.</li>
          <li>• VAT treatment is confirmed in your quote (shop prices follow site tax settings).</li>
          <li>• Third-party gateway, API or software fees are not included unless stated.</li>
          <li>• Ongoing support is only included when a support package is agreed.</li>
        </ul>
        <Button href={`/contact?service=${service.slug}`} className="mt-4">
          Request a Quote
        </Button>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-xl font-semibold">FAQ</h2>
        <div className="mt-4">
          <FaqAccordion items={service.faqs} />
        </div>
      </section>

      {related.length ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">Related services</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/services/${item.slug}`}
                  className="surface block rounded-lg p-4 text-sm transition hover:border-accent/40"
                >
                  <span className="font-display font-semibold text-white">{item.shortTitle}</span>
                  <span className="mt-1 block text-foreground-muted">{item.summary}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-12 surface rounded-lg px-6 py-8 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="font-display text-xl font-semibold text-white">
            Ready to discuss this service?
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Share your systems and constraints. You will get a scoped reply—not a pressure pitch.
          </p>
        </div>
        <Button href={`/contact?service=${service.slug}`} className="mt-4 shrink-0 sm:mt-0">
          Discuss Your Project
        </Button>
      </div>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          serviceJsonLd({
            name: service.title,
            description: service.summary,
            path: `/services/${service.slug}`,
          }),
        ]}
      />
    </Container>
  );
}
