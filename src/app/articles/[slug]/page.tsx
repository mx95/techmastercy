import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Container } from "@/components/site/Container";
import { articles, getArticle } from "@/content/articles";
import { createMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
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
  });
}

export default async function ArticlePage({ params }: { params: Params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <Container className="py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Articles", path: "/articles" },
          { name: article.title, path: `/articles/${article.slug}` },
        ]}
      />
      <article className="mt-6 max-w-3xl">
        <h1 className="font-display text-4xl font-semibold text-white">{article.title}</h1>
        <p className="mt-4 text-foreground-muted">{article.description}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-foreground-muted">
          {article.body.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </article>
    </Container>
  );
}
