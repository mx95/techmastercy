"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import clsx from "clsx";
import { CartButton } from "@/components/cart/CartButton";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

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

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1220]/95 pt-[env(safe-area-inset-top)] backdrop-blur-md">
      <Container className="flex min-h-14 items-center justify-between gap-2 py-2 sm:min-h-16 sm:gap-3">
        <BrandLogo
          priority
          onClick={() => setOpen(false)}
          className="min-w-0 shrink"
        />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navLinks.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
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
            className="hidden min-h-11 sm:inline-flex"
          >
            Discuss Your Project
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
            {navLinks.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
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
            Discuss Your Project
          </Button>
        </Container>
      </div>
    </header>
  );
}
