import { Container } from "@/components/site/Container";

export default function ContactLoading() {
  return (
    <Container className="py-6 sm:py-10 lg:py-16" aria-busy="true" aria-live="polite">
      <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
      <div className="mt-6 h-8 w-64 max-w-full animate-pulse rounded bg-white/10" />
      <div className="mt-3 h-16 w-full max-w-lg animate-pulse rounded bg-white/5" />
      <div className="mt-8 h-[28rem] w-full animate-pulse rounded-lg border border-white/10 bg-white/5" />
      <span className="sr-only">Loading contact page</span>
    </Container>
  );
}
