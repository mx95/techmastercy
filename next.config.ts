import type { NextConfig } from "next";

const oneDay = "public, max-age=86400, stale-while-revalidate=604800";
const oneWeek = "public, max-age=604800, stale-while-revalidate=2592000";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  // Keep dynamic admin/shop routes request-time; Cache Components can force
  // surprising static shells around cookie/session boundaries.
  cacheComponents: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Origin image optimizer cache (seconds). Free win without a CDN.
    minimumCacheTTL: 60 * 60 * 24 * 7,
  },
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: oneWeek }],
      },
      {
        source: "/favicon.ico",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        source: "/robots.txt",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
      {
        source: "/sitemap.xml",
        headers: [{ key: "Cache-Control", value: oneDay }],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
