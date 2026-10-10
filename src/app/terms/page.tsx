import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { LEGAL_DRAFT_NOTICE } from "@/lib/legal-notice";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms and conditions",
  description: "Draft terms and conditions for TechmasterCY.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Terms", path: "/terms" }]} />
      <p className="mt-4 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
        {LEGAL_DRAFT_NOTICE}
      </p>
      <h1 className="mt-6 font-display text-3xl font-semibold">Terms and conditions</h1>
      <div className="mt-6 max-w-3xl space-y-4 text-sm text-foreground-muted">
        <p>
          These draft terms cover use of the TechmasterCY website, service enquiries and purchases from
          the online shop. Service engagements are additionally governed by a written proposal or
          statement of work.
        </p>
        <p>
          Product descriptions aim to be accurate. Indicative service prices are not fixed quotes.
          Digital products are only sold when published with available files.
        </p>
        <p>
          Orders become binding after payment is verified by TechmasterCY&apos;s server-side payment
          process. A browser redirect alone does not confirm payment.
        </p>
      </div>
    </Container>
  );
}
