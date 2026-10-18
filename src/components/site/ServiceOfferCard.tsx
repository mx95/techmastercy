import Image from "next/image";
import Link from "next/link";

export type ServiceOffer = {
  name: string;
  summary: string;
  detail: string;
  href: string;
  label: string;
  iconSrc: string;
  iconAlt: string;
};

export function ServiceOfferCard({ offer }: { offer: ServiceOffer }) {
  return (
    <Link
      href={offer.href}
      className="group flex h-full flex-col rounded-xl border border-white/10 bg-background-elevated/70 p-5 transition hover:border-accent/45 hover:bg-accent-dim/30 sm:p-6"
    >
      <Image
        src={offer.iconSrc}
        alt={offer.iconAlt}
        width={64}
        height={64}
        className="h-14 w-14 rounded-[14px] transition duration-300 group-hover:scale-[1.04] sm:h-16 sm:w-16"
        unoptimized
      />
      <h2 className="mt-5 font-display text-xl font-semibold text-white group-hover:text-accent-soft sm:text-2xl">
        {offer.name}
      </h2>
      <p className="mt-2 text-sm font-medium text-accent-soft">{offer.summary}</p>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground-muted sm:text-[0.95rem]">
        {offer.detail}
      </p>
      <span className="mt-5 text-sm font-semibold text-accent-soft">
        {offer.label} →
      </span>
    </Link>
  );
}
