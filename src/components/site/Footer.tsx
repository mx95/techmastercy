import Link from "next/link";
import { BrandLogo } from "@/components/site/BrandLogo";
import { Button } from "@/components/site/Button";
import { Container } from "@/components/site/Container";
import { SocialLinks } from "@/components/site/SocialLinks";
import { petpal } from "@/content/petpal";
import { servicePillars } from "@/content/service-pillars";
import { siteConfig } from "@/lib/config";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/articles", label: "Insights" },
  { href: "/shop", label: "Shop" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy policy" },
  { href: "/terms", label: "Terms and conditions" },
  { href: "/refunds", label: "Refunds" },
  { href: "/licence", label: "Licence" },
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#080d18]">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <BrandLogo showTagline={false} />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-foreground-muted">
            A technology and software engineering company helping businesses integrate, build and
            improve their digital solutions—with payment integrations as a specialist focus.
          </p>
          <p className="mt-4 text-sm">
            <a
              href={`mailto:${siteConfig.businessEmail}`}
              className="font-medium text-accent-soft transition-colors hover:text-accent"
            >
              {siteConfig.businessEmail}
            </a>
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            Based in Cyprus · Available for international projects · EUR · English
          </p>
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
              Follow
            </p>
            <SocialLinks className="mt-2 flex flex-wrap gap-2" />
          </div>
          <Button href="/contact" className="mt-6 w-full sm:w-auto">
            Start a conversation
          </Button>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            Services
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
            {servicePillars.map((pillar) => (
              <li key={pillar.slug}>
                <Link
                  href={`/services/${pillar.slug}`}
                  className="transition-colors hover:text-accent-soft"
                >
                  {pillar.navLabel}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/services" className="transition-colors hover:text-accent-soft">
                All services
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            Company
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-accent-soft">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-foreground">
            Legal
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-accent-soft">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 border-t border-white/5 pt-6">
            <h2 className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-foreground-muted">
              Related project
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              <a
                href={petpal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-soft transition-colors hover:text-accent"
              >
                {petpal.name}
              </a>
              <span className="mt-1 block text-xs">
                Separate pet-care platform — own catalogue and checkout.
              </span>
            </p>
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 py-6 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. {siteConfig.domain}
          </p>
          <p>Practical technology delivery for businesses in Cyprus and beyond.</p>
        </Container>
      </div>
    </footer>
  );
}
