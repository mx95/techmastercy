import Link from "next/link";
import { CtaButton } from "@/components/analytics/CtaButton";
import { ServicePageView } from "@/components/analytics/ServicePageView";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { JsonLd } from "@/components/site/JsonLd";
import { getSeoLander, type SeoLander } from "@/content/seo-landers";
import {
  breadcrumbJsonLd,
  createMetadata,
  faqJsonLd,
  serviceJsonLd,
} from "@/lib/seo";

export function landerMetadata(slug: string) {
  const lander = getSeoLander(slug);
  if (!lander) {
    return createMetadata({
      title: "Page not found",
      description: "Service page unavailable.",
      path: `/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: lander.metaTitle,
    description: lander.metaDescription,
    path: lander.path,
  });
}

export function CommercialLanderPage({ slug }: { slug: string }) {
  const lander = getSeoLander(slug);
  if (!lander) return null;
  return <CommercialLanderView lander={lander} />;
}

function CommercialLanderView({ lander }: { lander: SeoLander }) {
  const contactHref = `/contact?service=${encodeURIComponent(lander.contactService)}`;

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <ServicePageView path={lander.path} name={lander.schemaName} />
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: lander.title, path: lander.path },
          ]),
          serviceJsonLd({
            name: lander.schemaName,
            description: lander.schemaDescription,
            path: lander.path,
          }),
          faqJsonLd(lander.faqs),
        ]}
      />

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: lander.title, path: lander.path },
        ]}
      />

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
          Services
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">
          {lander.h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-foreground-muted">{lander.intro}</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <CtaButton
            href={contactHref}
            size="lg"
            className="w-full sm:w-auto"
            eventParams={{ location: lander.slug, cta: "discuss_project" }}
          >
            Discuss your project
          </CtaButton>
          <Button
            href="/services/payment-solutions"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto"
          >
            Payment Solutions overview
          </Button>
        </div>
      </header>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-white">Problems we solve</h2>
        <ul className="mt-5 space-y-3 text-base leading-relaxed text-foreground-muted">
          {lander.problems.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-white">How we help</h2>
        <ul className="mt-5 space-y-3 text-base leading-relaxed text-foreground-muted">
          {lander.solutions.map((item) => (
            <li key={item} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-white">Implementation approach</h2>
        <ol className="mt-5 list-decimal space-y-3 pl-5 text-base leading-relaxed text-foreground-muted">
          {lander.implementation.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-white">Related pages</h2>
        <ul className="mt-5 space-y-2 text-base text-foreground-muted">
          {lander.relatedPaths.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-accent-soft underline-offset-4 hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-semibold text-white">FAQs</h2>
        <div className="mt-5">
          <FaqAccordion items={lander.faqs} />
        </div>
      </section>

      <section className="mt-16 max-w-3xl rounded-lg border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-white">
          Ready to talk through your integration?
        </h2>
        <p className="mt-3 text-foreground-muted">
          Tell us your platform, payment provider and what “paid” must mean in your systems. You
          will get a clear next step—not a generic sales script.
        </p>
        <div className="mt-6">
          <CtaButton
            href={contactHref}
            size="lg"
            eventParams={{ location: lander.slug, cta: "request_quote" }}
          >
            Request a quote
          </CtaButton>
        </div>
      </section>
    </Container>
  );
}
