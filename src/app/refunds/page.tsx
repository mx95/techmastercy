import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { LEGAL_DRAFT_NOTICE } from "@/lib/legal-notice";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Refund policy",
  description: "Draft refund policy for TechmasterCY products and services.",
  path: "/refunds",
});

export default function RefundsPage() {
  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Refunds", path: "/refunds" },
        ]}
      />
      <p className="mt-4 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
        {LEGAL_DRAFT_NOTICE}
      </p>
      <h1 className="mt-6 font-display text-3xl font-semibold">Refund policy</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-sm text-foreground-muted">
        <p>
          Physical products may be eligible for return if unused and in original condition within a
          period you define before launch (to be confirmed legally). Shipping costs may be
          non-refundable unless the item is faulty.
        </p>
        <p>
          Digital products, once download access has been issued, are generally non-refundable except
          where required by applicable consumer law or where the file cannot be delivered.
        </p>
        <p>
          Service deposits and completed professional work are handled according to the engagement
          proposal. Contact support with your order reference to discuss a refund request.
        </p>
      </div>
    </Container>
  );
}
