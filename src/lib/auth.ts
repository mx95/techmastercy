import { SignJWT, jwtVerify } from "jose";
import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { getSessionSecret } from "@/lib/config";
import { prisma } from "@/lib/db";

const COOKIE_NAME = "tmc_admin_session";
const MAX_AGE = 60 * 60 * 12; // 12 hours

export type AdminSession = {
  sub: string;
  email: string;
  name: string;
};

function secretKey() {
  return new TextEncoder().encode(getSessionSecret());
}

/**
 * Only mark cookies Secure when the browser is actually on HTTPS.
 * Production over http://IP (pre-DNS) must not use Secure, or the session is dropped.
 */
async function cookieSecureFlag(): Promise<boolean> {
  if (process.env.COOKIE_SECURE === "true") return true;
  if (process.env.COOKIE_SECURE === "false") return false;

  const h = await headers();
  const forwarded = h.get("x-forwarded-proto") || h.get("x-forwarded-protocol");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim().toLowerCase() === "https";
  }

  // Fall back only when proxy headers are absent.
  const appUrl = process.env.APP_URL || process.env.SITE_URL || "";
  return appUrl.startsWith("https://");
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(user: {
  id: string;
  email: string;
  name: string;
}): Promise<void> {
  const token = await new SignJWT({
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secretKey());

  const jar = await cookies();
  const secure = await cookieSecureFlag();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  const secure = await cookieSecureFlag();
  jar.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || typeof payload.email !== "string") return null;

    const user = await prisma.adminUser.findUnique({
      where: { id: payload.sub },
    });
    if (!user || !user.active) return null;

    return {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
  } catch {
    return null;
  }
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}
