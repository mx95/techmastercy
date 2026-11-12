import type { Metadata } from "next";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";

export const metadata: Metadata = {
  title: "Page not found | TechmasterCY",
  description: "That URL is not part of the TechmasterCY website.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-start justify-center py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">404</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-3 max-w-lg text-foreground-muted">
        That URL is not part of this site. Try the homepage, services catalogue, or contact form.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button href="/" className="w-full sm:w-auto">
          Go home
        </Button>
        <Button href="/contact" variant="secondary" className="w-full sm:w-auto">
          Contact us
        </Button>
        <Button href="/payment-integration" variant="ghost" className="w-full sm:w-auto">
          Payment integration
        </Button>
      </div>
    </Container>
  );
}
