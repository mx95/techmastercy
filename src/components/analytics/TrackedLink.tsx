"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  trackEvent,
  type AnalyticsEventName,
} from "@/components/analytics/track";

export function TrackedLink({
  href,
  event,
  params,
  className,
  children,
  external,
}: {
  href: string;
  event: AnalyticsEventName;
  params?: Record<string, string | number | boolean | undefined>;
  className?: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      className={className}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onClick={() => trackEvent(event, { ...params, href })}
    >
      {children}
    </Link>
  );
}

export function TrackedMailto({
  email,
  className,
  children,
}: {
  email: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`mailto:${email}`}
      className={className}
      onClick={() => trackEvent("email_click", { email })}
    >
      {children}
    </a>
  );
}

export function TrackedTel({
  phone,
  className,
  children,
}: {
  phone: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={`tel:${phone}`}
      className={className}
      onClick={() => trackEvent("phone_click", { phone })}
    >
      {children}
    </a>
  );
}
