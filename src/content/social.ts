/**
 * Verified TechmasterCY social profiles only.
 * Source: https://techmaster.com.cy Shopify header/footer social list (checked Oct 2026).
 * Only Instagram is published on the live storefront — do not invent other profile URLs.
 */
export type SocialLink = {
  platform: "linkedin" | "facebook" | "instagram" | "x" | "youtube" | "github";
  label: string;
  href: string;
};

export const socialLinks: SocialLink[] = [
  {
    platform: "instagram",
    label: "TechmasterCY on Instagram",
    href: "https://www.instagram.com/techmastercy/",
  },
];
