import Link from "next/link";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import { ServiceSelector } from "@/components/services/ServiceSelector";
import { aiAutomationLanding } from "@/content/ai-automation";
import { getServicesByCategory } from "@/content/services";
import {
  breadcrumbJsonLd,
  createMetadata,
  serviceJsonLd,
} from "@/lib/seo";

export const metadata = createMetadata({
  title: aiAutomationLanding.title,
  description: aiAutomationLanding.summary,
  path: "/services/ai-automation",
});

export default function AiAutomationLandingPage() {
  const related = getServicesByCategory("ai-automation");

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: "AI & Automation", path: "/services/ai-automation" },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs uppercase tracking-[0.18em] text-accent">
          AI, Automation & Technical Consulting
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-white sm:text-5xl">
          Make AI and automation useful in real business workflows
        </h1>
        <p className="mt-4 text-lg text-foreground-muted">{aiAutomationLanding.summary}</p>
        <p className="mt-3 text-sm text-foreground-muted">
          Each project starts with a defined business problem. Solutions are tested before they are
          relied upon in production. AI is not promised to be always accurate, and automation is not
          claimed to replace all human review.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href="#consultation">Request a consultation</Button>
          <Button href="/contact?service=ai-consulting-implementation" variant="secondary">
            Contact form
          </Button>
        </div>
      </header>

      <section className="mt-12 grid gap-4 lg:grid-cols-2">
        <div className="surface rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">Problems we help solve</h2>
          <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
            {aiAutomationLanding.problems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
        <div className="surface rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold">Suitable use cases</h2>
          <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
            {aiAutomationLanding.useCases.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Implementation process</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {aiAutomationLanding.process.map((step, index) => (
            <li key={step.title} className="surface rounded-lg p-5">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                0{index + 1}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-foreground-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-12 surface rounded-lg p-6">
        <h2 className="font-display text-xl font-semibold">
          Security, privacy and human oversight
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-foreground-muted">
          {aiAutomationLanding.oversight.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Pricing guidance</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground-muted">
          These are proposed introductory packages, not guaranteed market rates. Confirm inclusions,
          exclusions and third-party API or software charges before work begins. No package is
          unlimited support.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {aiAutomationLanding.packages.map((pkg) => (
            <article key={pkg.id} className="surface flex flex-col rounded-lg p-5">
              <h3 className="font-display text-lg font-semibold">{pkg.name}</h3>
              <p className="mt-2 text-2xl font-semibold text-accent-soft">{pkg.priceLabel}</p>
              <p className="mt-3 text-sm text-foreground-muted">{pkg.summary}</p>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                  Included
                </p>
                <ul className="mt-2 space-y-1 text-sm text-foreground-muted">
                  {pkg.included.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground">
                  Excluded
                </p>
                <ul className="mt-2 space-y-1 text-sm text-foreground-muted">
                  {pkg.excluded.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <Button
                href={`/contact?service=ai-automation-support-plans`}
                variant="secondary"
                className="mt-5"
              >
                Enquire about {pkg.name}
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Related services</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {related.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="surface rounded-lg p-5 transition hover:border-accent/40"
            >
              <h3 className="font-display text-lg font-semibold group-hover:text-accent-soft">
                {service.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-muted">{service.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold">FAQ</h2>
        <div className="mt-4">
          <FaqAccordion items={[...aiAutomationLanding.faqs]} />
        </div>
      </section>

      <section id="consultation" className="mt-14 scroll-mt-24">
        <ServiceSelector />
      </section>

      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: aiAutomationLanding.title, path: "/services/ai-automation" },
          ]),
          serviceJsonLd({
            name: aiAutomationLanding.title,
            description: aiAutomationLanding.summary,
            path: "/services/ai-automation",
          }),
        ]}
      />
    </Container>
  );
}
