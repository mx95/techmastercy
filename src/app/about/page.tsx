import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { PetPalCard } from "@/components/site/PetPalCard";
import { SectionHeading } from "@/components/site/SectionHeading";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "About",
  description:
    "TechmasterCY focuses on online payment integrations, reliable business systems and practical developer tools for Cyprus.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
      />
      <SectionHeading
        className="mt-6"
        eyebrow="About"
        title="Technical focus without the brochure fiction"
        description="TechmasterCY helps businesses accept online payments, adopt practical AI and automation, troubleshoot technical issues and connect the systems around checkout."
      />
      <div className="mt-10 max-w-3xl space-y-6 text-foreground-muted">
        <p>
          The work centres on payment gateway integrations, JCC workflows where merchant
          access allows, WooCommerce and Shopify payment setups, custom application
          integrations, REST APIs, webhooks, practical AI implementation, business process
          automation, scoped technical support, and backend development in stacks such as
          Java/Spring Boot, .NET and SQL-backed services.
        </p>
        <p>
          The approach is practical: validate totals on the server, verify payment
          notifications, test automations before production reliance, keep human oversight
          where consequential actions are involved, and leave operators with notes they can
          actually use. No invented certifications, partner logos or customer counts appear on
          this site.
        </p>
        <p>
          Alongside services, TechmasterCY operates an online shop for selected technology
          products and is preparing digital developer kits—starting with a Webhook Reliability
          Kit that will remain unpublished until the product files are packaged and tested.
          Pet-care hardware lives on the separate PetPal Care Hub project at petpal.com.cy.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/contact">Discuss Your Project</Button>
        <Button href="/services" variant="secondary">
          Explore Services
        </Button>
      </div>
      <div className="mt-12">
        <PetPalCard compact />
      </div>
    </Container>
  );
}
