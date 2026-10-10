import Link from "next/link";

export type Crumb = { name: string; href?: string; path?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-foreground-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const href = item.href || item.path;
          return (
            <li key={`${item.name}-${index}`} className="flex items-center gap-2">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {href && !isLast ? (
                <Link href={href} className="transition-colors hover:text-accent-soft">
                  {item.name}
                </Link>
              ) : (
                <span
                  className={isLast ? "text-foreground" : undefined}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
