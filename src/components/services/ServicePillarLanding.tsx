import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { JsonLd } from "@/components/site/JsonLd";
import { PaymentProvidersSection } from "@/components/site/PaymentProvidersSection";
import {
  getPillarServices,
  type ServicePillar,
} from "@/content/service-pillars";
import { formatEur } from "@/lib/money";
import { breadcrumbJsonLd, serviceJsonLd } from "@/lib/seo";

export function ServicePillarLanding({
  pillar,
  children,
}: {
  pillar: ServicePillar;
  children?: React.ReactNode;
}) {
  const related = getPillarServices(pillar);
  const path = `/services/${pillar.slug}`;

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: pillar.title, path },
          ]),
          serviceJsonLd({
            name: pillar.title,
            description: pillar.description,
            path,
          }),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: pillar.navLabel, path },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
          {pillar.navLabel}
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
          {pillar.title}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground-muted">
          {pillar.description}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            href={`/contact?service=${pillar.contactService}`}
            size="lg"
            className="w-full sm:w-auto"
          >
            Let’s discuss your project
          </Button>
          <Button href="/services" variant="secondary" size="lg" className="w-full sm:w-auto">
            All services
          </Button>
        </div>
      </header>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-white">Problems we solve</h2>
        <ul className="mt-5 max-w-3xl space-y-3 text-base leading-relaxed text-foreground-muted">
          {pillar.problems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-white">
          Available services
        </h2>
        <ul className="mt-5 max-w-3xl space-y-3 text-base leading-relaxed text-foreground-muted">
          {pillar.offerings.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {pillar.id === "payment-solutions" ? (
        <div className="mt-14">
          <PaymentProvidersSection compact />
        </div>
      ) : null}

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-white">How we work</h2>
        <ol className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {pillar.process.map((step, index) => (
            <li key={step.title}>
              <p className="font-display text-sm font-semibold tabular-nums text-accent-soft">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-display text-xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-white">
          Relevant technologies
        </h2>
        <ul className="mt-5 flex flex-wrap gap-2">
          {pillar.technologies.map((tech) => (
            <li
              key={tech}
              className="rounded-md border border-white/10 bg-background-elevated/60 px-3 py-1.5 text-sm text-foreground-muted"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold text-white">
            Detailed service pages
          </h2>
          <div className="mt-6 grid gap-4">
            {related.map((service) => (
              <article
                key={service.slug}
                className="flex flex-col gap-4 border-b border-white/10 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8"
              >
                <div className="max-w-2xl">
                  <h3 className="font-display text-xl font-semibold">
                    <Link
                      href={`/services/${service.slug}`}
                      className="hover:text-accent-soft"
                    >
                      {service.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm text-foreground-muted">{service.summary}</p>
                  {service.pricing.fromEur ? (
                    <p className="mt-3 text-sm text-accent-soft">
                      From {formatEur(service.pricing.fromEur * 100)} · {service.pricing.note}
                    </p>
                  ) : null}
                </div>
                <Button
                  href={`/services/${service.slug}`}
                  variant="secondary"
                  className="w-full shrink-0 sm:w-auto"
                >
                  View details
                </Button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {children}

      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold text-white">
          Frequently asked questions
        </h2>
        <div className="mt-6 max-w-3xl">
          <FaqAccordion items={pillar.faqs} />
        </div>
      </section>

      <section className="mt-16 border-t border-white/10 pt-12">
        <h2 className="font-display text-3xl font-semibold text-white">
          Have a project in mind?
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground-muted">
          Tell us what you are trying to achieve. We will discuss your requirements and help you
          identify the right approach.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button
            href={`/contact?service=${pillar.contactService}`}
            size="lg"
            className="w-full sm:w-auto"
          >
            Start a conversation
          </Button>
          <Button href="/contact" variant="secondary" size="lg" className="w-full sm:w-auto">
            Open contact form
          </Button>
        </div>
      </section>
    </Container>
  );
}
