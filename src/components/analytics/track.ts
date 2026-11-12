export type AnalyticsEventName =
  | "generate_lead"
  | "cta_click"
  | "email_click"
  | "phone_click"
  | "service_page_view";

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
    __tmcConsent?: "granted" | "denied";
  }
}

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return window.__tmcConsent === "granted";
}

export function getGaMeasurementId(): string | null {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
  return id || null;
}

/** Fire only when consent is granted and GA is configured. Never invent hits. */
export function trackEvent(
  name: AnalyticsEventName,
  params?: Record<string, string | number | boolean | undefined>,
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  if (!getGaMeasurementId()) return;
  if (typeof window.gtag !== "function") return;

  const cleaned: Record<string, string | number | boolean> = {};
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) cleaned[key] = value;
    }
  }
  window.gtag("event", name, cleaned);
}
