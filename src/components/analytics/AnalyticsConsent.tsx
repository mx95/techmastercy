"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { getGaMeasurementId } from "@/components/analytics/track";

const STORAGE_KEY = "tmc_analytics_consent";

function readStoredConsent(): "granted" | "denied" | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
  } catch {
    /* ignore */
  }
  return null;
}

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("tmc-consent", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("tmc-consent", onStoreChange);
  };
}

function ensureGtagStub() {
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag === "function") return;
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
}

function loadGtag(measurementId: string) {
  if (typeof window === "undefined") return;
  ensureGtagStub();
  window.gtag?.("consent", "update", {
    analytics_storage: "granted",
  });

  if (!document.getElementById("tmc-gtag")) {
    const script = document.createElement("script");
    script.id = "tmc-gtag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  window.gtag?.("js", new Date());
  window.gtag?.("config", measurementId, {
    anonymize_ip: true,
  });
}

function writeConsent(value: "granted" | "denied") {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* ignore */
  }
  window.__tmcConsent = value;
  window.dispatchEvent(new Event("tmc-consent"));
}

export function AnalyticsConsent() {
  const measurementId = getGaMeasurementId();
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const stored = useSyncExternalStore(
    subscribeConsent,
    readStoredConsent,
    () => null,
  );

  useEffect(() => {
    if (!measurementId || !hydrated) return;
    ensureGtagStub();
    window.gtag?.("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      wait_for_update: 500,
    });
    if (stored === "granted") {
      window.__tmcConsent = "granted";
      loadGtag(measurementId);
    } else if (stored === "denied") {
      window.__tmcConsent = "denied";
    }
  }, [measurementId, stored, hydrated]);

  const accept = useCallback(() => {
    if (!measurementId) return;
    writeConsent("granted");
    loadGtag(measurementId);
  }, [measurementId]);

  const decline = useCallback(() => {
    writeConsent("denied");
  }, []);

  if (!measurementId || !hydrated || stored !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics cookies"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/15 bg-[#071018]/95 p-4 backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-foreground-muted">
          We use optional analytics cookies (Google Analytics 4) to understand which service pages
          help visitors and whether enquiries succeed. No ads. See the{" "}
          <Link href="/privacy" className="text-accent-soft underline-offset-2 hover:underline">
            privacy policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="min-h-11 rounded-md border border-white/25 bg-white/5 px-4 text-sm font-semibold text-foreground hover:bg-white/10"
            onClick={decline}
          >
            Decline
          </button>
          <button
            type="button"
            className="min-h-11 rounded-md bg-accent px-4 text-sm font-semibold text-[#041018] hover:bg-accent-soft"
            onClick={accept}
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
