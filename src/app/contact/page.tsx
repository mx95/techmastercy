import { Suspense } from "react";
import { ContactForm } from "@/app/contact/ContactForm";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SocialLinks } from "@/components/site/SocialLinks";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Contact — discuss your project",
  description:
    "Contact TechmasterCY in Cyprus about payment gateway integration, API work, automation or AI implementation. Short form, clear next steps.",
  path: "/contact",
});

function ContactAside() {
  return (
    <div className="space-y-3 text-sm text-foreground-muted">
      <h2 className="font-display text-base font-semibold text-white">
        What happens after you submit
      </h2>
      <ol className="list-decimal space-y-2 pl-5">
        <li>Your enquiry is stored securely (and emailed when SMTP is configured).</li>
        <li>We review the systems involved and what you want to achieve.</li>
        <li>You receive a scoped reply with clarifying questions or an indicative quote.</li>
      </ol>
      <p className="text-xs">
        Response times are not guaranteed until confirmed in writing. Prefer email for the first
        reply unless you need a call.
      </p>
      <ul className="list-disc space-y-2 pl-5">
        <li>Include platform, payment provider and what fails today when relevant.</li>
        <li>Indicative package prices are proposals until confirmed in a quote.</li>
        <li>Third-party provider fees and subscriptions are separate unless stated otherwise.</li>
      </ul>
      <SocialLinks className="mt-4 flex flex-wrap gap-2" />
    </div>
  );
}

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : undefined;

  return (
    <Container className="min-w-0 py-6 sm:py-10 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Contact" },
        ]}
      />
      {/*
        Mobile: short intro → form → details.
        Desktop: intro + details in left column; form spans the right column.
      */}
      <div className="mt-4 grid min-w-0 gap-6 lg:mt-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:items-start">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
            Contact
          </p>
          <h1 className="mt-2 max-w-xl text-balance font-display text-[1.65rem] font-semibold leading-tight text-white sm:text-3xl lg:text-4xl">
            Discuss your project
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-foreground-muted sm:mt-3 sm:text-base">
            Tell us your systems and the outcome you need. You get a scoped reply—not an automated
            sales sequence.
          </p>
          <div className="mt-4 space-y-1.5 text-sm text-foreground-muted">
            <p>
              Email:{" "}
              <a
                className="font-medium text-accent-soft hover:underline"
                href={`mailto:${siteConfig.businessEmail}`}
              >
                {siteConfig.businessEmail}
              </a>
            </p>
            <p className="text-xs sm:text-sm">
              Primary market: Cyprus · Language: English · Currency: EUR
            </p>
          </div>
        </div>

        <div className="min-w-0 lg:row-span-2">
          <Suspense fallback={<p className="text-foreground-muted">Loading form…</p>}>
            <ContactForm defaultService={service} />
          </Suspense>
        </div>

        <div className="min-w-0">
          <ContactAside />
        </div>
      </div>
    </Container>
  );
}
