import { Container } from "@/components/site/Container";

export default function ShopLoading() {
  return (
    <Container className="py-8 sm:py-12 lg:py-16" aria-busy="true" aria-live="polite">
      <div className="h-4 w-24 animate-pulse rounded bg-white/10" />
      <div className="mt-6 h-8 w-72 max-w-full animate-pulse rounded bg-white/10" />
      <div className="mt-8 h-28 animate-pulse rounded-lg border border-white/10 bg-white/5" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="aspect-[4/3] animate-pulse rounded-lg border border-white/10 bg-white/5"
          />
        ))}
      </div>
      <span className="sr-only">Loading shop</span>
    </Container>
  );
}