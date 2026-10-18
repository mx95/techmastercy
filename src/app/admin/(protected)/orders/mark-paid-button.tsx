"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MarkPaidButton({
  orderId,
  disabled,
}: {
  orderId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (disabled || busy) return;
    if (!window.confirm("Mark this order as paid after confirming in Revolut?")) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/mark-paid`, {
        method: "POST",
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Failed.");
        setBusy(false);
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || busy}
        style={{
          padding: "0.35rem 0.65rem",
          borderRadius: 6,
          border: "1px solid #cbd5e1",
          background: disabled ? "#f1f5f9" : "#0f172a",
          color: disabled ? "#94a3b8" : "#fff",
          cursor: disabled || busy ? "not-allowed" : "pointer",
          fontSize: "0.8rem",
        }}
      >
        {busy ? "Saving…" : "Mark paid"}
      </button>
      {error ? (
        <div style={{ color: "#b91c1c", fontSize: "0.75rem", marginTop: 4 }}>{error}</div>
      ) : null}
    </div>
  );
}
