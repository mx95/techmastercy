import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaButton } from "@/components/analytics/CtaButton";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { JsonLd } from "@/components/site/JsonLd";
import { articles, getArticle } from "@/content/articles";
import { articleJsonLd, breadcrumbJsonLd, createMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  // Include drafts so preview builds can open them; metadata marks drafts noIndex.
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return createMetadata({
      title: "Article not found",
      description: "Article unavailable.",
      path: `/articles/${slug}`,
      noIndex: true,
    });
  }
  return createMetadata({
    title: article.title,
    description: article.description,
    path: `/articles/${article.slug}`,
    noIndex: article.status !== "published",
  });
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/articles/${article.slug}`;

  return (
    <Container className="min-w-0 py-8 sm:py-12 lg:py-16">
      {article.status === "published" ? (
        <JsonLd
          data={[
            breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Articles", path: "/articles" },
              { name: article.title, path },
            ]),
            articleJsonLd({
              title: article.title,
              description: article.description,
              path,
              publishedAt: article.publishedAt,
            }),
          ]}
        />
      ) : null}

      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: article.title, path },
        ]}
      />
      <article className="mt-6 max-w-3xl">
        {article.status === "draft" ? (
          <p className="mb-4 rounded-md border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
            Draft for review — not listed in the sitemap or articles index.
          </p>
        ) : null}
        <h1 className="font-display text-4xl font-semibold text-white">{article.title}</h1>
        <p className="mt-4 text-foreground-muted">{article.description}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground-muted">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        <aside className="mt-12 rounded-lg border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-display text-xl font-semibold text-white">Need this implemented?</h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Related service:{" "}
            <Link
              href={article.relatedPath}
              className="text-accent-soft underline-offset-4 hover:underline"
            >
              {article.relatedLabel}
            </Link>
          </p>
          <div className="mt-5">
            <CtaButton
              href={`/contact?service=${encodeURIComponent(article.contactService)}`}
              eventParams={{ location: article.slug, cta: "article_enquiry" }}
            >
              Start an enquiry
            </CtaButton>
          </div>
        </aside>
      </article>
    </Container>
  );
}
