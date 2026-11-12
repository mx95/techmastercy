"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/analytics/track";

/** Fires once per mount when consent already granted (banner accept happens later without remount). */
export function ServicePageView({
  path,
  name,
}: {
  path: string;
  name: string;
}) {
  useEffect(() => {
    trackEvent("service_page_view", { page_path: path, service_name: name });
  }, [path, name]);
  return null;
}
