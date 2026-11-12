import type { Metadata } from "next";
import { socialLinks } from "@/content/social";
import { siteConfig } from "@/lib/config";

export function absoluteUrl(path = "/"): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function createMetadata(options: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(options.path || "/");
  const title = options.title.includes(siteConfig.name)
    ? options.title
    : `${options.title} | ${siteConfig.name}`;
  const imageUrl = absoluteUrl(
    options.ogImage || "/images/brand/emblem-black-on-white.png",
  );

  return {
    title,
    description: options.description,
    alternates: { canonical: url },
    robots: options.noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description: options.description,
      url,
      siteName: siteConfig.name,
      locale: "en_CY",
      type: "website",
      images: [{ url: imageUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: options.description,
      images: [imageUrl],
    },
  };
}

export function organizationJsonLd() {
  const sameAs = socialLinks.map((link) => link.href);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    email: siteConfig.businessEmail,
    logo: absoluteUrl("/images/brand/emblem-black-on-white.png"),
    image: absoluteUrl("/images/brand/emblem-black-on-white.png"),
    address: {
      "@type": "PostalAddress",
      addressCountry: "CY",
    },
    // Cyprus HQ with international remote delivery — matches visible site copy.
    areaServed: ["CY", "Worldwide"],
    knowsAbout: siteConfig.keywords,
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export function faqJsonLd(items: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

export function serviceJsonLd(service: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: absoluteUrl(service.path),
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    areaServed: ["CY", "Worldwide"],
  };
}

export function articleJsonLd(article: {
  title: string;
  description: string;
  path: string;
  publishedAt?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    mainEntityOfPage: absoluteUrl(article.path),
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/images/brand/emblem-black-on-white.png"),
      },
    },
    inLanguage: "en",
  };
}

export function productJsonLd(product: {
  name: string;
  description: string;
  path: string;
  priceCents: number;
  images: string[];
  availability: "InStock" | "OutOfStock" | "PreOrder";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((img) => absoluteUrl(img)),
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(product.path),
      priceCurrency: "EUR",
      price: (product.priceCents / 100).toFixed(2),
      availability: `https://schema.org/${product.availability}`,
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
