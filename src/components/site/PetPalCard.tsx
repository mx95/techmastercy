import { petpal } from "@/content/petpal";
import { Button } from "@/components/site/Button";

export function PetPalCard({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      className={`surface rounded-lg ${compact ? "p-4" : "p-6 sm:p-8"}`}
      aria-label={petpal.headline}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">
        Related project
      </p>
      <h2
        className={`mt-2 font-display font-semibold text-white ${
          compact ? "text-lg" : "text-2xl"
        }`}
      >
        {petpal.headline}
      </h2>
      <p className={`mt-3 text-foreground-muted ${compact ? "text-sm" : "text-base"}`}>
        {petpal.description}
      </p>
      {!compact ? (
        <p className="mt-3 text-xs text-foreground-muted">{petpal.note}</p>
      ) : null}
      <div className="mt-5">
        <Button
          href={petpal.url}
          variant="secondary"
          size={compact ? "sm" : "md"}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visit {petpal.name}
        </Button>
      </div>
    </aside>
  );
}
