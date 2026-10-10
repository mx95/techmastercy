"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/site/Button";
import { services } from "@/content/services";

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    setFieldError(null);
    const form = event.currentTarget;
    const fd = new FormData(form);
    const engagement = String(fd.get("engagementType") || "");
    const budget = String(fd.get("budgetRange") || "");
    let description = String(fd.get("description") || "");
    const extras: string[] = [];
    if (engagement) extras.push(`Preferred engagement: ${engagement}`);
    if (budget) extras.push(`Indicative budget: ${budget}`);
    if (extras.length) {
      description = `${description}\n\n—\n${extras.join("\n")}`;
    }

    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("company") || ""),
      website: String(fd.get("website") || ""),
      service: String(fd.get("service") || ""),
      paymentProvider: String(fd.get("paymentProvider") || ""),
      description,
      preferredContact: String(fd.get("preferredContact") || "email"),
      websiteConfirm: String(fd.get("websiteConfirm") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        emailDelivered?: boolean;
        emailNote?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setFieldError(data.error || "Could not submit the form. Please check the fields and try again.");
        return;
      }
      setStatus("success");
      form.reset();
      if (data.emailDelivered) {
        setMessage(
          "Thanks — your enquiry was saved and emailed to us. We will reply with next steps or clarifying questions.",
        );
      } else {
        setMessage(
          `Thanks — your enquiry was saved. ${data.emailNote || "Email delivery is not configured yet; your message is still stored and we will follow up."}`,
        );
      }
    } catch {
      setStatus("error");
      setFieldError("Network error. Please try again, or email us directly.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative space-y-4 rounded-lg border border-white/15 bg-background-elevated/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]"
      noValidate={false}
      aria-describedby="contact-privacy"
    >
      <p className="text-sm text-foreground-muted">
        Required fields are enough for a useful first reply. Optional fields help us scope
        faster—skip anything you are unsure about.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-foreground-muted">(required)</span>
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className="mt-1 min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Business email <span className="text-foreground-muted">(required)</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            required
            autoComplete="email"
            className="mt-1 min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="text-sm font-medium">
            Company <span className="text-foreground-muted">(optional)</span>
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            className="mt-1 min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="website" className="text-sm font-medium">
            Website URL <span className="text-foreground-muted">(optional)</span>
          </label>
          <input
            id="website"
            name="website"
            type="url"
            inputMode="url"
            autoComplete="url"
            className="mt-1 min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
            placeholder="https://"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className="text-sm font-medium">
            Service category
          </label>
          <select
            id="service"
            name="service"
            required
            defaultValue={defaultService || "payment-gateway-integration"}
            className="mt-1 min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
          >
            {services.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
            <option value="other">Other / not sure</option>
          </select>
        </div>
        <div>
          <label htmlFor="paymentProvider" className="text-sm font-medium">
            Payment provider <span className="text-foreground-muted">(if relevant)</span>
          </label>
          <input
            id="paymentProvider"
            name="paymentProvider"
            placeholder="JCC, Stripe, PayPal…"
            className="mt-1 min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Short description of the problem <span className="text-foreground-muted">(required)</span>
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          rows={5}
          className="mt-1 min-h-32 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
          placeholder="What systems do you use, what should happen, and what is broken or missing today?"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="engagementType" className="text-sm font-medium">
            Engagement type <span className="text-foreground-muted">(optional)</span>
          </label>
          <select
            id="engagementType"
            name="engagementType"
            defaultValue=""
            className="mt-1 min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
          >
            <option value="">Not sure yet</option>
            <option value="one-time project">One-time project</option>
            <option value="investigation / fix">Investigation / fix</option>
            <option value="ongoing support">Ongoing support</option>
          </select>
        </div>
        <div>
          <label htmlFor="budgetRange" className="text-sm font-medium">
            Indicative budget <span className="text-foreground-muted">(optional)</span>
          </label>
          <select
            id="budgetRange"
            name="budgetRange"
            defaultValue=""
            className="mt-1 min-h-11 w-full rounded-md border border-white/15 bg-background px-3 py-2.5 text-base sm:text-sm"
          >
            <option value="">Prefer not to say</option>
            <option value="under €200">Under €200</option>
            <option value="€200–€500">€200–€500</option>
            <option value="€500–€1,500">€500–€1,500</option>
            <option value="€1,500+">€1,500+</option>
          </select>
        </div>
      </div>
      <fieldset>
        <legend className="text-sm font-medium">Preferred contact method</legend>
        <div className="mt-2 flex flex-wrap gap-4 text-sm">
          {[
            { value: "email", label: "Email" },
            { value: "phone", label: "Phone" },
            { value: "either", label: "Either" },
          ].map((option) => (
            <label key={option.value} className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="preferredContact"
                value={option.value}
                defaultChecked={option.value === "email"}
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="websiteConfirm">Leave blank</label>
        <input id="websiteConfirm" name="websiteConfirm" tabIndex={-1} autoComplete="off" />
      </div>
      <p id="contact-privacy" className="text-xs text-foreground-muted">
        By submitting, you agree that we may use your details to respond to this enquiry. We do not
        sell your data. See the{" "}
        <Link href="/privacy" className="text-accent-soft underline-offset-2 hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <Button
        type="submit"
        size="lg"
        className="w-full sm:w-auto"
        disabled={status === "loading"}
        aria-busy={status === "loading"}
      >
        {status === "loading" ? "Sending…" : "Discuss Your Project"}
      </Button>
      {fieldError ? (
        <p role="alert" className="text-sm text-danger">
          {fieldError}
        </p>
      ) : null}
      {message ? (
        <p role="status" aria-live="polite" className="text-sm text-success">
          {message}
        </p>
      ) : null}
    </form>
  );
}
