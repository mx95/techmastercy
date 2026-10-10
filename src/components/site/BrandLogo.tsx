import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { siteConfig } from "@/lib/config";

/**
 * Header/footer brand lockup.
 * Emblem: uploaded black mark on white (`emblem-black-on-white.png`).
 * Wordmark: HTML text (Techmaster + CY). Do not overwrite source logo files.
 */
export function BrandLogo({
  href = "/",
  className,
  priority = false,
  onClick,
  showTagline = true,
}: {
  href?: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
  showTagline?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-label={`${siteConfig.name} home`}
      className={clsx(
        "inline-flex min-w-0 max-w-full items-center gap-2 sm:gap-2.5",
        className,
      )}
    >
      <Image
        src="/images/brand/emblem-black-on-white.png"
        alt=""
        width={48}
        height={48}
        className="h-9 w-9 shrink-0 rounded-md object-contain sm:h-10 sm:w-10"
        priority={priority}
        aria-hidden
      />
      <span className="flex min-w-0 flex-col justify-center" aria-hidden="true">
        <span className="truncate font-display text-[0.95rem] font-semibold leading-none tracking-tight sm:text-lg">
          <span className="text-white">Techmaster</span>
          <span className="text-accent">CY</span>
        </span>
        {showTagline ? (
          <span className="mt-1 hidden text-[0.65rem] font-medium leading-none tracking-[0.04em] text-foreground-muted lg:block">
            Payments · Automation · AI
          </span>
        ) : null}
      </span>
    </Link>
  );
}
