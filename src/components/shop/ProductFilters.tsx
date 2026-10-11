"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

type CategoryOption = { slug: string; name: string; count: number };

export function ProductFilters({ categories }: { categories: CategoryOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value) params.delete(key);
      else params.set(key, value);
      startTransition(() => {
        router.push(`/shop?${params.toString()}`);
      });
    },
    [router, searchParams],
  );

  const hasFilters = Boolean(
    searchParams.get("q") ||
      searchParams.get("category") ||
      searchParams.get("type") ||
      (searchParams.get("sort") && searchParams.get("sort") !== "relevance"),
  );

  return (
    <form
      className="surface grid min-w-0 gap-3 rounded-lg p-4 md:grid-cols-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        update("q", String(fd.get("q") || ""));
      }}
      aria-busy={pending}
    >
      <div className="md:col-span-2">
        <label htmlFor="shop-q" className="sr-only">
          Search products
        </label>
        <input
          id="shop-q"
          name="q"
          type="search"
          defaultValue={searchParams.get("q") || ""}
          placeholder="Search products"
          className="min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="shop-category" className="sr-only">
          Category
        </label>
        <select
          id="shop-category"
          value={searchParams.get("category") || ""}
          onChange={(e) => update("category", e.target.value)}
          className="min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name} ({c.count})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="shop-sort" className="sr-only">
          Sort
        </label>
        <select
          id="shop-sort"
          value={searchParams.get("sort") || "relevance"}
          onChange={(e) => update("sort", e.target.value)}
          className="min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="newest">Newest</option>
        </select>
      </div>
      <div className="md:col-span-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update("type", "")}
          className={`min-h-11 rounded-md px-3 py-2 text-sm ${
            !searchParams.get("type") ? "bg-accent text-background" : "bg-white/5"
          }`}
        >
          All types
        </button>
        <button
          type="button"
          onClick={() => update("type", "PHYSICAL")}
          className={`min-h-11 rounded-md px-3 py-2 text-sm ${
            searchParams.get("type") === "PHYSICAL"
              ? "bg-accent text-background"
              : "bg-white/5"
          }`}
        >
          Physical
        </button>
        <button
          type="button"
          onClick={() => update("type", "DIGITAL")}
          className={`min-h-11 rounded-md px-3 py-2 text-sm ${
            searchParams.get("type") === "DIGITAL"
              ? "bg-accent text-background"
              : "bg-white/5"
          }`}
        >
          Digital
        </button>
        <button
          type="submit"
          className="min-h-11 rounded-md bg-white/10 px-4 py-2 text-sm hover:bg-white/15 sm:ml-auto"
        >
          Search
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={() => {
              startTransition(() => {
                router.push("/shop");
              });
            }}
            className="min-h-11 rounded-md border border-white/15 px-4 py-2 text-sm text-foreground-muted hover:text-foreground"
          >
            Clear filters
          </button>
        ) : null}
      </div>
    </form>
  );
}
