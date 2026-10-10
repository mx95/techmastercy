import Link from "next/link";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { SectionHeading } from "@/components/site/SectionHeading";
import { articles } from "@/content/articles";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Articles",
  description:
    "Technical notes on payment integration, JCC workflows, webhooks and checkout reliability for Cyprus businesses.",
  path: "/articles",
});

export default function ArticlesPage() {
  return (
    <Container className="py-12 lg:py-16">
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
        description="Short, practical articles—not thin keyword pages."
      />
      <div className="mt-10 grid gap-4">
        {articles.map((article) => (
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
