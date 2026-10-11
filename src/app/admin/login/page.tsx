"use client";

import { FormEvent, useState, type CSSProperties } from "react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Login failed.");
        return;
      }
      // Full document navigation so the Set-Cookie from login is sent on /admin.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- soft client nav can race the session cookie
      window.location.assign("/admin");
      return;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background:
          "radial-gradient(circle at top, #1e293b 0%, #0f172a 45%, #020617 100%)",
        color: "#e2e8f0",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "100%",
          maxWidth: 400,
          display: "grid",
          gap: "0.85rem",
          padding: "1.75rem",
          border: "1px solid rgba(148,163,184,0.25)",
          background: "rgba(15,23,42,0.85)",
        }}
      >
        <div>
          <p style={{ margin: 0, letterSpacing: "0.08em", fontSize: "0.75rem", opacity: 0.7 }}>
            TECHMASTERCY
          </p>
          <h1 style={{ margin: "0.35rem 0 0", fontSize: "1.5rem" }}>Admin login</h1>
        </div>
        <label style={{ display: "grid", gap: 6, fontSize: "0.9rem" }}>
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </label>
        <label style={{ display: "grid", gap: 6, fontSize: "0.9rem" }}>
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </label>
        {error ? (
          <p style={{ margin: 0, color: "#fca5a5", fontSize: "0.9rem" }}>{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          style={{
            marginTop: "0.25rem",
            padding: "0.75rem 1rem",
            border: 0,
            background: "#38bdf8",
            color: "#0f172a",
            fontWeight: 600,
            cursor: pending ? "wait" : "pointer",
          }}
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </main>
  );
}

const inputStyle: CSSProperties = {
  padding: "0.65rem 0.75rem",
  border: "1px solid rgba(148,163,184,0.35)",
  background: "#020617",
  color: "#f8fafc",
  outline: "none",
};
