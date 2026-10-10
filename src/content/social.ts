/**
 * Verified TechmasterCY social profiles only.
 * Source: https://techmaster.com.cy (Shopify footer, Oct 2026).
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
