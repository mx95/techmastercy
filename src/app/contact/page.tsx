import { Suspense } from "react";
import { ContactForm } from "@/app/contact/ContactForm";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact",
  description:
    "Request a payment integration quote or ask about TechmasterCY services and products.",
  path: "/contact",
});

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : undefined;

  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Contact" },
        ]}
      />
      <div className="mt-6 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Request Payment Integration"
            description="Share enough context for a scoped reply. Enquiries are stored securely; email is sent when SMTP is configured."
          />
          <div className="mt-6 space-y-3 text-sm text-foreground-muted">
            <p>
              Email:{" "}
              <a
                className="text-accent-soft hover:underline"
                href={`mailto:${siteConfig.businessEmail}`}
              >
                {siteConfig.businessEmail}
              </a>
            </p>
            <p>Primary market: Cyprus · Language: English · Currency: EUR</p>
          </div>
        </div>
        <Suspense fallback={<p className="text-foreground-muted">Loading form…</p>}>
          <ContactForm defaultService={service} />
        </Suspense>
      </div>
    </Container>
  );
}
