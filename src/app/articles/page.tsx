import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { getPublishedArticles } from "@/content/articles";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Articles — payment integration engineering",
  description:
    "Technical notes on payment gateway integration, webhooks, 3DS, JCC and checkout reliability for teams shipping card payments.",
  path: "/articles",
});

export default function ArticlesPage() {
  const published = getPublishedArticles();

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
        ]}
      />
      <SectionHeading
        className="mt-6"
        eyebrow="Articles"
        title="Technical notes that help buyers decide"
        description="Practical payment-engineering writing—not thin keyword pages. New drafts are reviewed before they appear here."
      />
      <div className="mt-10 grid gap-4">
        {published.map((article) => (
          <article key={article.slug} className="surface rounded-lg p-6">
            <h2 className="font-display text-xl font-semibold">
              <Link href={`/articles/${article.slug}`} className="hover:text-accent-soft">
                {article.title}
              </Link>
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">{article.description}</p>
          </article>
        ))}
      </div>
    </Container>
  );
}
