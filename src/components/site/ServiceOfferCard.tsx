import Link from "next/link";
import clsx from "clsx";

export type ServiceOffer = {
  name: string;
  summary: string;
  detail: string;
  href: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
  examples?: string[];
  featured?: boolean;
};

export function ServiceOfferCard({ offer }: { offer: ServiceOffer }) {
  return (
    <Link
      href={offer.href}
      className={clsx(
        "group flex h-full flex-col rounded-xl border p-5 transition sm:p-6",
        offer.featured
          ? "border-accent/40 bg-accent-dim/25 hover:border-accent/60 hover:bg-accent-dim/40 sm:col-span-2 lg:col-span-1"
          : "border-white/10 bg-background-elevated/70 hover:border-accent/45 hover:bg-accent-dim/30",
      )}
    >
      {/* Native img keeps SVG marks crisp without Next image optimizer limits */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={offer.iconSrc}
        alt={offer.iconAlt}
        width={64}
        height={64}
        className="h-14 w-14 rounded-[14px] transition duration-300 group-hover:scale-[1.04] sm:h-16 sm:w-16"
      />
      {offer.featured ? (
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-soft">
          Primary focus
        </p>
      ) : null}
      <h2
        className={clsx(
          "font-display font-semibold text-white group-hover:text-accent-soft",
          offer.featured ? "mt-2 text-2xl sm:text-3xl" : "mt-5 text-xl sm:text-2xl",
        )}
      >
        {offer.name}
      </h2>
      <p className="mt-2 text-sm font-medium text-accent-soft">{offer.summary}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted sm:text-[0.95rem]">
        {offer.detail}
      </p>
      {offer.examples && offer.examples.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {offer.examples.map((example) => (
            <li
              key={example}
              className="rounded-md border border-white/10 px-2.5 py-1 text-xs text-foreground-muted"
            >
              {example}
            </li>
          ))}
        </ul>
      ) : null}
      <span className="mt-5 text-sm font-semibold text-accent-soft">
        {offer.label} →
      </span>
    </Link>
  );
}
