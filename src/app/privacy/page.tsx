import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { LEGAL_DRAFT_NOTICE } from "@/lib/legal-notice";
import { siteConfig } from "@/lib/config";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy policy",
  description: "Draft privacy policy for TechmasterCY.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <Container className="prose-invert min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
      />
      <p className="mt-4 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
        {LEGAL_DRAFT_NOTICE}
      </p>
      <h1 className="mt-6 font-display text-3xl font-semibold">Privacy policy</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-sm text-foreground-muted">
        <p>
          TechmasterCY ({siteConfig.domain}) collects only the information needed to respond to
          enquiries and fulfil shop orders—typically name, email, optional company/website details,
          order contents and shipping address for physical goods.
        </p>
        <p>
          Payment card data is handled by the configured payment provider. TechmasterCY does not store
          raw card numbers or CVVs.
        </p>
        <p>
          Enquiry and order records are retained for operational and accounting needs. Contact{" "}
          {siteConfig.businessEmail} to request access or correction of personal data you have
          submitted.
        </p>
        <p>
          This draft does not claim GDPR certification or list a data protection officer. Complete a
          jurisdiction-specific review before launch.
        </p>
      </div>
    </Container>
  );
}
