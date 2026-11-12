"use client";

import { Button } from "@/components/site/Button";
import { trackEvent } from "@/components/analytics/track";
import type { ComponentProps } from "react";

type ButtonLinkProps = Extract<ComponentProps<typeof Button>, { href: string }>;

export function CtaButton({
  eventParams,
  onClick,
  ...props
}: ButtonLinkProps & {
  eventParams?: Record<string, string | number | boolean | undefined>;
}) {
  return (
    <Button
      {...props}
      onClick={() => {
        trackEvent("cta_click", { href: props.href, ...eventParams });
        onClick?.();
      }}
    />
  );
}
