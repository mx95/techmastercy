"use client";

import { useRouter } from "next/navigation";
import { useState, type CSSProperties } from "react";
import { formatEur } from "@/lib/money";

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  priceCents: number;
  stock: number | null;
  type: "DIGITAL" | "PHYSICAL";
};

export function ProductsTable({ products }: { products: AdminProductRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<
    Record<string, { priceEur: string; stock: string }>
  >(() =>
    Object.fromEntries(
      products.map((p) => [
        p.id,
        {
          priceEur: (p.priceCents / 100).toFixed(2),
          stock: p.stock === null ? "" : String(p.stock),
        },
      ]),
    ),
  );

  async function patch(id: string, body: Record<string, unknown>) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...body }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Update failed.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error ? (
        <p style={{ color: "#b91c1c", marginBottom: "0.75rem" }}>{error}</p>
      ) : null}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
              <th style={th}>Product</th>
              <th style={th}>Status</th>
              <th style={th}>Price (€)</th>
              <th style={th}>Stock</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const draft = drafts[product.id] ?? {
                priceEur: (product.priceCents / 100).toFixed(2),
                stock: product.stock === null ? "" : String(product.stock),
              };
              return (
                <tr key={product.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                    <div style={{ opacity: 0.6, fontSize: "0.8rem" }}>
                      {product.slug} · {product.type} · {formatEur(product.priceCents)}
                    </div>
                  </td>
                  <td style={td}>{product.status}</td>
                  <td style={td}>
                    <input
                      value={draft.priceEur}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [product.id]: { ...draft, priceEur: e.target.value },
                        }))
                      }
                      style={input}
                      inputMode="decimal"
                    />
                  </td>
                  <td style={td}>
                    <input
                      value={draft.stock}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [product.id]: { ...draft, stock: e.target.value },
                        }))
                      }
                      placeholder={product.type === "DIGITAL" ? "n/a" : "0"}
                      style={input}
                      inputMode="numeric"
                    />
                  </td>
                  <td style={td}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                      <button
                        type="button"
                        disabled={busyId === product.id}
                        onClick={() =>
                          patch(product.id, {
                            status:
                              product.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
                          })
                        }
                        style={btn}
                      >
                        {product.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        type="button"
                        disabled={busyId === product.id}
                        onClick={() => {
                          const euros = Number(draft.priceEur);
                          if (!Number.isFinite(euros) || euros < 0) {
                            setError("Enter a valid price.");
                            return;
                          }
                          const priceCents = Math.round(euros * 100);
                          const stockValue =
                            draft.stock.trim() === ""
                              ? null
                              : Number.parseInt(draft.stock, 10);
                          if (
                            draft.stock.trim() !== "" &&
                            (!Number.isInteger(stockValue) || (stockValue ?? 0) < 0)
                          ) {
                            setError("Enter a valid stock quantity.");
                            return;
                          }
                          patch(product.id, {
                            priceCents,
                            stock: stockValue,
                          });
                        }}
                        style={btn}
                      >
                        Save
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: CSSProperties = { padding: "0.65rem 0.4rem" };
const td: CSSProperties = { padding: "0.75rem 0.4rem", verticalAlign: "top" };
const input: CSSProperties = {
  width: 96,
  padding: "0.4rem 0.5rem",
  border: "1px solid #cbd5e1",
  background: "#fff",
};
const btn: CSSProperties = {
  padding: "0.35rem 0.65rem",
  border: "1px solid #cbd5e1",
  background: "#fff",
  cursor: "pointer",
};
