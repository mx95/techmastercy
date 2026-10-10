import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        color: "#0f172a",
        fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 1.5rem",
          borderBottom: "1px solid #e2e8f0",
          background: "#fff",
        }}
      >
        <div>
          <strong>TechmasterCY Admin</strong>
          <span style={{ marginLeft: "0.75rem", opacity: 0.65, fontSize: "0.9rem" }}>
            {session.email}
          </span>
        </div>
        <nav style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", fontSize: "0.95rem" }}>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/enquiries">Enquiries</Link>
          <LogoutButton />
        </nav>
      </header>
      <main style={{ padding: "1.5rem", maxWidth: 1100, margin: "0 auto" }}>
        {children}
      </main>
    </div>
  );
}
