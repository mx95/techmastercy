import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteFaqs } from "@/content/faqs";
import { createMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about TechmasterCY payment integration services, support scope, and shop.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <JsonLd data={faqJsonLd(siteFaqs)} />
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
      <SectionHeading
        className="mt-6"
        eyebrow="FAQ"
        title="Questions and answers"
        description="Clear answers about services, support expectations, payments work in Cyprus, and the shop."
      />
      <div className="mt-8 max-w-3xl">
        <FaqAccordion items={siteFaqs} />
      </div>
    </Container>
  );
}
