import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js 16 Proxy (formerly Middleware).
 * Sets baseline security headers without interfering with static assets.
 */
export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") || "").toLowerCase();
  // Consolidate www → apex so organic signals do not split across hosts.
  if (host === "www.techmaster.com.cy") {
    const url = request.nextUrl.clone();
    url.hostname = "techmaster.com.cy";
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );

  // Avoid caching authenticated admin HTML at intermediaries.
  if (request.nextUrl.pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next internals and common static file extensions.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml|woff|woff2)$).*)",
  ],
};
