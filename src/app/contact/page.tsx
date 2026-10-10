import { Suspense } from "react";
import { ContactForm } from "@/app/contact/ContactForm";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { SocialLinks } from "@/components/site/SocialLinks";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact — discuss your project",
  description:
    "Contact TechmasterCY in Cyprus about payment gateway integration, API work, automation or AI implementation. Short form, clear next steps.",
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
            title="Discuss your project"
            description="Tell us your systems and the outcome you need. You get a scoped reply—not an automated sales sequence."
          />
          <div className="mt-6 space-y-3 text-sm text-foreground-muted">
            <p>
              Email:{" "}
              <a
                className="font-medium text-accent-soft hover:underline"
                href={`mailto:${siteConfig.businessEmail}`}
              >
                {siteConfig.businessEmail}
              </a>
            </p>
            <p>Primary market: Cyprus · Language: English · Currency: EUR</p>
            <h2 className="pt-2 font-display text-base font-semibold text-white">
              What happens after you submit
            </h2>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Your enquiry is stored securely (and emailed when SMTP is configured).</li>
              <li>We review the systems involved and what you want to achieve.</li>
              <li>You receive a scoped reply with clarifying questions or an indicative quote.</li>
            </ol>
            <p className="text-xs">
              Response times are not guaranteed until confirmed in writing. Prefer email for the
              first reply unless you need a call.
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>Include platform, payment provider and what fails today when relevant.</li>
              <li>Indicative package prices are proposals until confirmed in a quote.</li>
              <li>Third-party provider fees and subscriptions are separate unless stated otherwise.</li>
            </ul>
            <SocialLinks className="mt-6 flex flex-wrap gap-2" />
          </div>
        </div>
        <Suspense fallback={<p className="text-foreground-muted">Loading form…</p>}>
          <ContactForm defaultService={service} />
        </Suspense>
      </div>
    </Container>
  );
}
