import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { PetPalCard } from "@/components/site/PetPalCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About TechmasterCY",
  description:
    "TechmasterCY is a Cyprus-based technology and software engineering company focused on practical payment integrations, software delivery and digital solutions.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <SectionHeading
        className="mt-6"
        eyebrow="About"
        title="Practical engineering you can talk to"
        description="TechmasterCY helps businesses integrate, build and improve digital solutions—with payment systems as a specialist focus."
      />

      <div className="mt-10 max-w-3xl space-y-6 text-base leading-relaxed text-foreground-muted">
        <p>
          The company works with merchants, product teams and agencies that need reliable technical
          delivery without the theatre. That means clear scope, honest constraints and
          implementations that operators can understand after handover.
        </p>
        <p>
          Work typically covers payment gateway integrations, APIs and webhooks, custom backend
          services, business process automation, practical AI adoption where it fits a real
          workflow, website and e-commerce support, and smart technology consulting when it is
          useful. Stacks often include Java/Spring Boot, .NET and SQL-backed services alongside
          storefront platforms such as WooCommerce and Shopify.
        </p>
        <p>
          The approach is deliberate: verify payment amounts on the server, design for retries and
          failure, keep human oversight where consequential actions are involved, and avoid claims
          that cannot be demonstrated. You will not find invented certifications, partner logos or
          customer counts on this site.
        </p>
        <p>
          TechmasterCY is based in Cyprus and works in English and EUR. International projects are
          welcome when remote collaboration and documentation access make the work practical.
          Alongside services, a small online shop sells selected technology products. Pet-care
          hardware lives on the separate PetPal Care Hub at petpal.com.cy.
        </p>
      </div>

      <div className="mt-10 grid gap-8 border-t border-white/10 pt-10 sm:grid-cols-3">
        {[
          {
            title: "Transparent communication",
            body: "Direct technical discussion, plain-language scope and no automated sales drip.",
          },
          {
            title: "Reliable delivery",
            body: "Tested paths, documented handovers and support that matches what was agreed.",
          },
          {
            title: "Approachable by design",
            body: "Comfortable for small businesses, e-commerce teams, startups and agencies alike.",
          },
        ].map((item) => (
          <div key={item.title}>
            <h2 className="font-display text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{item.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button href="/contact" className="w-full sm:w-auto">
          Let’s discuss your project
        </Button>
        <Button href="/services" variant="secondary" className="w-full sm:w-auto">
          Explore services
        </Button>
        <Button
          href={`mailto:${siteConfig.businessEmail}`}
          variant="ghost"
          className="w-full sm:w-auto"
        >
          Email {siteConfig.businessEmail}
        </Button>
      </div>

      <div className="mt-12">
        <PetPalCard compact />
      </div>
    </Container>
  );
}
