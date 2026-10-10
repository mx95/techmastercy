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
  return createMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <Container className="py-12 lg:py-16">
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
        <div className="mt-6">
          <Button href={`/contact?service=${service.slug}`}>Request a quote</Button>
        </div>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <section className="surface rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">Problem it solves</h2>
          <p className="mt-3 text-sm text-foreground-muted">{service.problem}</p>
        </section>
        <section className="surface rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">Who needs it</h2>
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
        <h2 className="font-display text-xl font-semibold">Process</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-2">
          {service.process.map((step, index) => (
            <li key={step} className="text-sm text-foreground-muted">
              <span className="font-display text-accent">0{index + 1}</span>{" "}
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-8 surface rounded-lg p-6">
        <h2 className="font-display text-xl font-semibold">{service.pricing.label}</h2>
        {service.pricing.fromEur ? (
          <p className="mt-2 text-2xl font-semibold text-accent-soft">
            From {formatEur(service.pricing.fromEur * 100)}
          </p>
        ) : null}
        <p className="mt-2 text-sm text-foreground-muted">{service.pricing.note}</p>
        <Button href={`/contact?service=${service.slug}`} className="mt-4">
          Request a quote
        </Button>
      </section>

      <section className="mt-10 max-w-3xl">
        <h2 className="font-display text-xl font-semibold">FAQ</h2>
        <div className="mt-4">
          <FaqAccordion items={service.faqs} />
        </div>
      </section>

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
