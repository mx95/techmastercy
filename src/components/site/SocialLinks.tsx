import { socialLinks, type SocialLink } from "@/content/social";

function SocialIcon({ platform }: { platform: SocialLink["platform"] }) {
  switch (platform) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5zm8.75 2a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
        </svg>
      );
    case "facebook":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5H16.8V4.1C16.3 4 15.3 4 14.2 4c-2.4 0-4 1.4-4 4.1V11H7.5v3h2.7v8h3.3z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M6.5 8.5H3.7V21h2.8V8.5zM5.1 3C4 3 3.1 3.9 3.1 5S4 7 5.1 7 7.1 6.1 7.1 5 6.2 3 5.1 3zM20.3 13.3c0-2.7-1.5-4.5-4.3-4.5-1.4 0-2.5.6-3.1 1.6h-.1V8.5H10v12.5h2.9v-6.2c0-1.6.3-3.2 2.3-3.2s2.1 1.8 2.1 3.3V21h2.9v-7.7z" />
        </svg>
      );
    case "x":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M4 4h3.5l4.1 5.7L16.4 4H20l-6.3 7.3L20.5 20H17l-4.5-6.2L7.3 20H4l6.7-7.8L4 4z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M22 12c0-2.2-.2-3.5-.4-4.3-.2-.8-.7-1.4-1.4-1.6C18.9 5.7 12 5.7 12 5.7s-6.9 0-8.2.4c-.7.2-1.2.8-1.4 1.6C2.2 8.5 2 9.8 2 12s.2 3.5.4 4.3c.2.8.7 1.4 1.4 1.6 1.3.4 8.2.4 8.2.4s6.9 0 8.2-.4c.7-.2 1.2-.8 1.4-1.6.2-.8.4-2.1.4-4.3zM10 15.5v-7l6 3.5-6 3.5z" />
        </svg>
      );
    case "github":
      return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
          <path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.2-3.4-1.2-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.3-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2.1 1-2.8-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c2-.1 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.7 1 2.8 0 4-2.3 4.8-4.6 5.1.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z" />
        </svg>
      );
    default:
      return null;
  }
}

export function SocialLinks({ className }: { className?: string }) {
  if (!socialLinks.length) return null;

  return (
    <ul className={className ?? "flex flex-wrap gap-2"} aria-label="Social media">
      {socialLinks.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/15 text-foreground-muted transition-colors hover:border-accent/50 hover:text-accent-soft"
          >
            <SocialIcon platform={link.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}
