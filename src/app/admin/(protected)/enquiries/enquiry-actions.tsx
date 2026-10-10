"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = [
  { value: "NEW", label: "New" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "CLOSED", label: "Resolved" },
] as const;

export function EnquiryStatusSelect({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onChange(next: string) {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error || "Update failed");
        return;
      }
      setValue(next);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="sr-only" htmlFor={`status-${id}`}>
        Enquiry status
      </label>
      <select
        id={`status-${id}`}
        value={value}
        disabled={busy}
        onChange={(event) => void onChange(event.target.value)}
        style={{ padding: "0.35rem 0.5rem" }}
      >
        {statuses.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      {error ? (
        <p role="alert" style={{ color: "#b91c1c", fontSize: "0.8rem", margin: "0.25rem 0 0" }}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
