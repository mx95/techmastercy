import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { siteFaqs } from "@/content/faqs";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "FAQ",
  description: "Frequently asked questions about TechmasterCY payment integration services and shop.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]} />
      <SectionHeading className="mt-6" eyebrow="FAQ" title="Questions and answers" />
      <div className="mt-8 max-w-3xl">
        <FaqAccordion items={siteFaqs} />
      </div>
    </Container>
  );
}
