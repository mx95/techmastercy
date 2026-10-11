import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { LEGAL_DRAFT_NOTICE } from "@/lib/legal-notice";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Digital product licence terms",
  description: "Draft licence terms for TechmasterCY digital products.",
  path: "/licence",
});

export default function LicencePage() {
  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Licence", path: "/licence" },
        ]}
      />
      <p className="mt-4 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
        {LEGAL_DRAFT_NOTICE}
      </p>
      <h1 className="mt-6 font-display text-3xl font-semibold">Digital product licence terms</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-sm text-foreground-muted">
        <p>
          When a digital product is published, the purchase grants a licence as described on the
          product page (for example individual developer or small team). Licence options and seat
          limits are configured per product.
        </p>
        <p>
          Unless stated otherwise, you may use the materials internally for your projects, but you may
          not resell, republish or redistribute the kit as a competing product.
        </p>
        <p>
          Download links expire and may have access limits. Keep your own secure copy after a
          successful download. No warranty of fitness for a particular purpose is claimed in this
          draft.
        </p>
      </div>
    </Container>
  );
}
