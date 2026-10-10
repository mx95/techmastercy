import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import {
  paymentMethodsNote,
  paymentProviders,
  paymentProvidersDisclaimer,
} from "@/content/payment-providers";

export function PaymentProvidersSection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const cyprus = paymentProviders.filter((p) => p.region === "cyprus");
  const international = paymentProviders.filter((p) => p.region === "international");

  const body = (
    <>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">
        Payment providers
      </p>
      <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold text-white">
        Providers we can assess and help integrate
      </h2>
      <p className="mt-3 max-w-2xl text-sm text-foreground-muted">
        Cyprus-first options first, then common international platforms. Final feasibility depends
        on your merchant account, documentation access and project scope.
      </p>

      <div className="mt-8 space-y-8">
        <ProviderGroup title="Cyprus-focused" items={cyprus} />
        <ProviderGroup title="International" items={international} />
      </div>

      <div className="surface mt-8 rounded-lg p-5">
        <h3 className="font-display text-lg font-semibold text-white">
          {paymentMethodsNote.title}
        </h3>
        <p className="mt-2 text-sm text-foreground-muted">{paymentMethodsNote.body}</p>
      </div>

      <p className="mt-4 text-xs text-foreground-muted">{paymentProvidersDisclaimer}</p>

      <div className="mt-6">
        <Button href="/contact?service=payment-gateway-integration">
          Discuss a Payment Integration
        </Button>
      </div>
    </>
  );

  if (compact) return <div>{body}</div>;

  return (
    <section className="border-b border-white/10 py-14 lg:py-16">
      <Container>{body}</Container>
    </section>
  );
}

function ProviderGroup({
  title,
  items,
}: {
  title: string;
  items: typeof paymentProviders;
}) {
  return (
    <div>
      <h3 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-foreground-muted">
        {title}
      </h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((provider) => (
          <li key={provider.slug} className="surface rounded-lg p-4">
            <p className="font-display text-base font-semibold text-white">{provider.name}</p>
            <p className="mt-2 text-sm text-foreground-muted">{provider.summary}</p>
            <ul className="mt-3 space-y-1 text-xs text-foreground-muted">
              {provider.capabilities.map((cap) => (
                <li key={cap}>• {cap}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs">
              <a
                href={provider.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-soft hover:underline"
              >
                Official documentation
              </a>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
