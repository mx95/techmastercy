"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      style={{
        border: 0,
        background: "transparent",
        color: "#0369a1",
        cursor: pending ? "wait" : "pointer",
        padding: 0,
        font: "inherit",
      }}
    >
      {pending ? "…" : "Log out"}
    </button>
  );
}
