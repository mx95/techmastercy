import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { PaymentProvidersSection } from "@/components/site/PaymentProvidersSection";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  serviceCategories,
  services,
  type ServiceCategory,
} from "@/content/services";
import { createMetadata } from "@/lib/seo";
import { formatEur } from "@/lib/money";

export const metadata = createMetadata({
  title: "Services — payment integration, automation & AI Cyprus",
  description:
    "Payment gateway integration Cyprus, API and webhook work, business process automation, AI consulting and scoped technical support.",
  path: "/services",
});

const categoryOrder: ServiceCategory[] = [
  "payments",
  "integrations",
  "ai-automation",
];

export default function ServicesPage() {
  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <SectionHeading
        className="mt-6"
        eyebrow="Services"
        title="Payment integrations, AI, automation and technical support"
        description="Each engagement is scoped to your systems and constraints. Indicative prices are starting points—request a quote for a fixed estimate."
      />

      <div className="surface mt-8 rounded-lg p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="font-display text-lg font-semibold">
            AI, Automation & Technical Consulting
          </h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Practical AI adoption, process automation and scoped remote support—with clear oversight
            expectations.
          </p>
        </div>
        <Button href="/services/ai-automation" className="mt-4 shrink-0 sm:mt-0">
          Open AI & automation hub
        </Button>
      </div>

      <div className="mt-12">
        <PaymentProvidersSection compact />
      </div>

      <div className="mt-12 space-y-12">
        {categoryOrder.map((category) => {
          const meta = serviceCategories[category];
          const items = services.filter((s) => s.category === category);
          return (
            <section key={category}>
              <h2 className="font-display text-2xl font-semibold text-white">{meta.title}</h2>
              <p className="mt-2 max-w-2xl text-sm text-foreground-muted">{meta.description}</p>
              <div className="mt-6 grid gap-4">
                {items.map((service) => (
                  <article
                    key={service.slug}
                    className="surface rounded-lg p-6 md:flex md:items-start md:justify-between md:gap-8"
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
                      className="mt-4 shrink-0 md:mt-0"
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
    </Container>
  );
}
