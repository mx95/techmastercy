"use client";

import { useState } from "react";
import { Button } from "@/components/site/Button";
import { services } from "@/content/services";

export function ContactForm({ defaultService }: { defaultService?: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage(null);
    const form = event.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      company: String(fd.get("company") || ""),
      website: String(fd.get("website") || ""),
      service: String(fd.get("service") || ""),
      paymentProvider: String(fd.get("paymentProvider") || ""),
      description: String(fd.get("description") || ""),
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
        setMessage(data.error || "Could not submit the form.");
        return;
      }
      setStatus("success");
      form.reset();
      if (data.emailDelivered) {
        setMessage("Enquiry saved and email delivered. We will reply soon.");
      } else {
        setMessage(
          `Enquiry saved successfully. ${data.emailNote || "Email delivery is not configured yet—your message is still stored."}`,
        );
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative space-y-4 rounded-lg border border-white/10 bg-background-elevated/40 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            autoComplete="name"
            className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium">
            Business email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="company" className="text-sm font-medium">
            Company (optional)
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="website" className="text-sm font-medium">
            Website URL (optional)
          </label>
          <input
            id="website"
            name="website"
            autoComplete="url"
            className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
            placeholder="https://"
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="service" className="text-sm font-medium">
            Service required
          </label>
          <select
            id="service"
            name="service"
            required
            defaultValue={defaultService || "payment-gateway-integration"}
            className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
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
            Payment provider (if relevant)
          </label>
          <input
            id="paymentProvider"
            name="paymentProvider"
            placeholder="JCC, Stripe, PayPal…"
            className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
          />
        </div>
      </div>
      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Project description
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={20}
          rows={6}
          className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2"
          placeholder="What are you trying to accept payments for, and what is broken or missing today?"
        />
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
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send enquiry"}
      </Button>
      {message ? (
        <p
          role="status"
          className={`text-sm ${status === "error" ? "text-danger" : "text-success"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
