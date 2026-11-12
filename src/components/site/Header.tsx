"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import clsx from "clsx";
import { CartButton } from "@/components/cart/CartButton";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { servicePillars } from "@/content/service-pillars";

const topLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/articles", label: "Insights" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const panelId = useId();
  const servicesMenuId = useId();
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!servicesOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!servicesRef.current?.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setServicesOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [servicesOpen]);

  const servicesActive =
    pathname === "/services" || pathname.startsWith("/services/");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1220]/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <Container className="flex min-h-14 items-center justify-between gap-2 py-2 sm:min-h-16 sm:gap-3">
        <BrandLogo
          priority
          onClick={() => setOpen(false)}
          className="min-w-0 shrink"
        />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          <Link
            href="/"
            className={clsx(
              "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/"
                ? "bg-white/5 text-accent-soft"
                : "text-foreground-muted hover:text-foreground",
            )}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            Home
          </Link>

          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              className={clsx(
                "inline-flex items-center gap-1 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                servicesActive
                  ? "bg-white/5 text-accent-soft"
                  : "text-foreground-muted hover:text-foreground",
              )}
              aria-expanded={servicesOpen}
              aria-controls={servicesMenuId}
              onClick={() => setServicesOpen((value) => !value)}
            >
              Services
              <span aria-hidden className="text-xs opacity-70">
                ▾
              </span>
            </button>
            <div
              id={servicesMenuId}
              hidden={!servicesOpen}
              className="absolute left-0 top-full z-50 mt-1 min-w-[17rem] rounded-lg border border-white/10 bg-background-elevated p-2 shadow-xl shadow-black/40"
            >
              <Link
                href="/services"
                onClick={() => setServicesOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-white/5 hover:text-accent-soft"
              >
                All services
              </Link>
              <div className="my-1 h-px bg-white/10" />
              {servicePillars.map((pillar) => (
                <Link
                  key={pillar.slug}
                  href={`/services/${pillar.slug}`}
                  onClick={() => setServicesOpen(false)}
                  className={clsx(
                    "block rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-white/5 hover:text-accent-soft",
                    pathname === `/services/${pillar.slug}`
                      ? "text-accent-soft"
                      : "text-foreground-muted",
                  )}
                >
                  {pillar.navLabel}
                  {pillar.featured ? (
                    <span className="mt-0.5 block text-xs text-foreground-muted">
                      Primary focus
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>

          {topLinks
            .filter((link) => link.href !== "/")
            .map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-white/5 text-accent-soft"
                      : "text-foreground-muted hover:text-foreground",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <Button
            href="/contact"
            size="sm"
            className="!hidden min-h-11 md:!inline-flex"
          >
            Let’s discuss your project
          </Button>
          <CartButton />
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/15 text-foreground lg:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" className="text-xl leading-none">
              {open ? "×" : "☰"}
            </span>
          </button>
        </div>
      </Container>

      <div
        id={panelId}
        hidden={!open}
        className="max-h-[calc(100dvh-3.5rem)] overflow-y-auto overscroll-contain border-t border-white/10 bg-background-elevated lg:hidden"
      >
        <Container className="flex flex-col py-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <nav aria-label="Mobile">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className={clsx(
                "block rounded-md px-3 py-3.5 text-base font-medium",
                pathname === "/" ? "text-accent-soft" : "text-foreground",
              )}
            >
              Home
            </Link>
            <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-[0.16em] text-foreground-muted">
              Services
            </p>
            <Link
              href="/services"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-3 text-base font-medium text-foreground"
            >
              All services
            </Link>
            {servicePillars.map((pillar) => (
              <Link
                key={pillar.slug}
                href={`/services/${pillar.slug}`}
                onClick={() => setOpen(false)}
                className={clsx(
                  "block rounded-md px-3 py-3 text-base",
                  pathname === `/services/${pillar.slug}`
                    ? "text-accent-soft"
                    : "text-foreground-muted",
                )}
              >
                {pillar.navLabel}
              </Link>
            ))}
            {topLinks
              .filter((link) => link.href !== "/")
              .map((link) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "block rounded-md px-3 py-3.5 text-base font-medium",
                      active ? "text-accent-soft" : "text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                );
              })}
          </nav>
          <Button
            href="/contact"
            className="mt-2 min-h-12"
            onClick={() => setOpen(false)}
          >
            Let’s discuss your project
          </Button>
        </Container>
      </div>
    </header>
  );
}
