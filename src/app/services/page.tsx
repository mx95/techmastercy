import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { PaymentProvidersSection } from "@/components/site/PaymentProvidersSection";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  getPillarServices,
  servicePillars,
} from "@/content/service-pillars";
import { formatEur } from "@/lib/money";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Services — payments, software, AI & digital solutions",
  description:
    "Explore TechmasterCY services: payment solutions, software and API development, AI and business automation, and digital solutions.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <SectionHeading
        className="mt-6"
        eyebrow="Services"
        title="Integrate, build and improve your digital solutions"
        description="Four clear service areas. Payment Solutions is the primary specialist focus; every engagement is scoped to your systems and constraints."
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {servicePillars.map((pillar) => (
          <Link
            key={pillar.slug}
            href={`/services/${pillar.slug}`}
            className={`group flex h-full flex-col rounded-xl border p-5 transition sm:p-6 ${
              pillar.featured
                ? "border-accent/40 bg-accent-dim/25 hover:border-accent/60"
                : "border-white/10 bg-background-elevated/70 hover:border-accent/45"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pillar.iconSrc}
              alt=""
              width={56}
              height={56}
              className="h-14 w-14"
            />
            {pillar.featured ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">
                Primary focus
              </p>
            ) : null}
            <h2 className="mt-2 font-display text-xl font-semibold text-white group-hover:text-accent-soft sm:text-2xl">
              {pillar.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
              {pillar.summary}
            </p>
            <span className="mt-5 text-sm font-semibold text-accent-soft">
              Learn more →
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12">
        <PaymentProvidersSection compact />
      </div>

      <div className="mt-14 space-y-14">
        {servicePillars.map((pillar) => {
          const items = getPillarServices(pillar);
          return (
            <section key={pillar.slug}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-white">
                    {pillar.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-foreground-muted">
                    {pillar.description}
                  </p>
                </div>
                <Button
                  href={`/services/${pillar.slug}`}
                  variant="secondary"
                  className="w-full shrink-0 sm:w-auto"
                >
                  Open {pillar.shortTitle}
                </Button>
              </div>
              <div className="mt-6 grid gap-4">
                {items.map((service) => (
                  <article
                    key={`${pillar.slug}-${service.slug}`}
                    className="border-b border-white/10 py-5 md:flex md:items-start md:justify-between md:gap-8"
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
                      className="mt-4 w-full shrink-0 md:mt-0 md:w-auto"
                    >
                      View details
                    </Button>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-16 border-t border-white/10 pt-12">
        <h2 className="font-display text-3xl font-semibold text-white">
          Have a project in mind?
        </h2>
        <p className="mt-3 max-w-2xl text-foreground-muted">
          Tell us what you are trying to achieve. We will help you identify the right service area
          and a practical next step.
        </p>
        <Button href="/contact" size="lg" className="mt-7 w-full sm:w-auto">
          Start a conversation
        </Button>
      </div>
    </Container>
  );
}
