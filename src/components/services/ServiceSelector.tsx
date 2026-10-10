"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/site/Button";
import {
  consultationNeedOptions,
  type ConsultationInput,
} from "@/lib/validation";

const needChoices: Array<{ id: (typeof consultationNeedOptions)[number]; label: string }> = [
  { id: "ai-implementation", label: "AI implementation" },
  { id: "business-automation", label: "Business automation" },
  { id: "online-payments", label: "Online payments" },
  { id: "website-api-troubleshooting", label: "Website or API troubleshooting" },
  { id: "data-processing-reporting", label: "Data processing and reporting" },
  { id: "technical-consulting", label: "Technical consulting" },
  { id: "something-else", label: "Something else" },
];

const steps = ["Needs", "Details", "Summary"] as const;

export function ServiceSelector() {
  const [step, setStep] = useState(0);
  const [needs, setNeeds] = useState<string[]>([]);
  const [problem, setProblem] = useState("");
  const [systems, setSystems] = useState("");
  const [engagementType, setEngagementType] =
    useState<ConsultationInput["engagementType"]>("not-sure");
  const [budgetRange, setBudgetRange] =
    useState<ConsultationInput["budgetRange"]>("not-sure");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  const needLabels = useMemo(
    () =>
      needs
        .map((id) => needChoices.find((c) => c.id === id)?.label || id)
        .join(", "),
    [needs],
  );

  function toggleNeed(id: string) {
    setNeeds((current) =>
      current.includes(id) ? current.filter((n) => n !== id) : [...current, id],
    );
  }

  function goNext() {
    setFieldError(null);
    if (step === 0 && needs.length === 0) {
      setFieldError("Select at least one area.");
      return;
    }
    if (step === 1) {
      if (problem.trim().length < 20) {
        setFieldError("Describe the problem in at least 20 characters.");
        return;
      }
      if (systems.trim().length < 2) {
        setFieldError("Tell us which systems or tools are involved.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFieldError(null);
    if (name.trim().length < 2 || !email.includes("@")) {
      setFieldError("Enter your name and a valid business email.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          needs,
          problem,
          systems,
          engagementType,
          budgetRange,
          websiteConfirm: "",
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        emailDelivered?: boolean;
        emailNote?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "Could not submit the request.");
        return;
      }

      setStatus("success");
      if (data.emailDelivered) {
        setMessage("Request saved and email delivered. We will reply with next steps.");
      } else {
        setMessage(
          `Request saved successfully. ${data.emailNote || "Email delivery is not configured yet—your request is still stored."}`,
        );
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="surface overflow-hidden rounded-xl">
      <div className="border-b border-white/10 px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent-soft">
          Service selector
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
          What does your business need help with?
        </h2>
        <ol className="mt-4 flex flex-wrap gap-2" aria-label="Progress">
          {steps.map((label, index) => (
            <li
              key={label}
              className={`rounded-md px-3 py-1 text-xs font-medium ${
                index === step
                  ? "bg-accent text-background"
                  : index < step
                    ? "bg-accent-dim text-accent-soft"
                    : "bg-white/5 text-foreground-muted"
              }`}
            >
              {index + 1}. {label}
            </li>
          ))}
        </ol>
      </div>

      <form onSubmit={onSubmit} className="space-y-5 px-5 py-6 sm:px-6">
        {step === 0 ? (
          <fieldset>
            <legend className="text-sm font-medium text-white">
              Select one or more areas
            </legend>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {needChoices.map((choice) => {
                const active = needs.includes(choice.id);
                return (
                  <label
                    key={choice.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-3 text-sm transition ${
                      active
                        ? "border-accent bg-accent-dim text-white"
                        : "border-white/10 text-foreground-muted hover:border-white/25"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleNeed(choice.id)}
                      className="size-4 accent-cyan-400"
                    />
                    {choice.label}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="sel-problem" className="text-sm font-medium">
                What problem are you trying to solve?
              </label>
              <textarea
                id="sel-problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                rows={4}
                className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2 text-sm"
                placeholder="Describe the outcome you need and what is blocking it today."
              />
            </div>
            <div>
              <label htmlFor="sel-systems" className="text-sm font-medium">
                Which systems or tools are involved?
              </label>
              <input
                id="sel-systems"
                value={systems}
                onChange={(e) => setSystems(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2 text-sm"
                placeholder="e.g. WooCommerce, JCC, Excel, custom CRM…"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sel-engagement" className="text-sm font-medium">
                  One-time project or ongoing support?
                </label>
                <select
                  id="sel-engagement"
                  value={engagementType}
                  onChange={(e) =>
                    setEngagementType(e.target.value as ConsultationInput["engagementType"])
                  }
                  className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2 text-sm"
                >
                  <option value="one-time">One-time project</option>
                  <option value="ongoing">Ongoing support</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
              <div>
                <label htmlFor="sel-budget" className="text-sm font-medium">
                  Preferred budget range
                </label>
                <select
                  id="sel-budget"
                  value={budgetRange}
                  onChange={(e) =>
                    setBudgetRange(e.target.value as ConsultationInput["budgetRange"])
                  }
                  className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2 text-sm"
                >
                  <option value="under-200">Under €200</option>
                  <option value="200-500">€200–€500</option>
                  <option value="500-1500">€500–€1,500</option>
                  <option value="1500-plus">€1,500+</option>
                  <option value="not-sure">Not sure / prefer a recommendation</option>
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-background/50 p-4 text-sm text-foreground-muted">
              <p>
                <span className="text-white">Areas:</span> {needLabels || "—"}
              </p>
              <p className="mt-2">
                <span className="text-white">Problem:</span> {problem}
              </p>
              <p className="mt-2">
                <span className="text-white">Systems:</span> {systems}
              </p>
              <p className="mt-2">
                <span className="text-white">Engagement:</span> {engagementType}
              </p>
              <p className="mt-2">
                <span className="text-white">Budget:</span> {budgetRange}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sel-name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="sel-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label htmlFor="sel-email" className="text-sm font-medium">
                  Business email
                </label>
                <input
                  id="sel-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="sel-company" className="text-sm font-medium">
                Company (optional)
              </label>
              <input
                id="sel-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-md border border-white/15 bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="hidden" aria-hidden="true">
              <label htmlFor="websiteConfirm">Leave blank</label>
              <input id="websiteConfirm" name="websiteConfirm" tabIndex={-1} autoComplete="off" />
            </div>
          </div>
        ) : null}

        {fieldError ? <p className="text-sm text-danger">{fieldError}</p> : null}
        {message ? (
          <p
            role="status"
            className={`text-sm ${status === "error" ? "text-danger" : "text-success"}`}
          >
            {message}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          {step > 0 && status !== "success" ? (
            <Button type="button" variant="secondary" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : null}
          {step < steps.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Continue
            </Button>
          ) : status !== "success" ? (
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Submitting…" : "Request a consultation"}
            </Button>
          ) : (
            <Button href="/services/ai-automation" variant="secondary">
              Explore AI & automation services
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
