import type { CSSProperties } from "react";
import { prisma } from "@/lib/db";
import { formatEur } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { items: true },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Orders</h1>
      <p style={{ opacity: 0.7 }}>Most recent orders (up to 200).</p>
      <div style={{ overflowX: "auto", marginTop: "1rem" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #e2e8f0" }}>
              <th style={th}>Reference</th>
              <th style={th}>Customer</th>
              <th style={th}>Status</th>
              <th style={th}>Payment</th>
              <th style={th}>Total</th>
              <th style={th}>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={td}>
                  <div style={{ fontWeight: 600 }}>{order.reference}</div>
                  <div style={{ opacity: 0.6, fontSize: "0.8rem" }}>
                    {order.items.length} item(s)
                    {order.paymentProvider ? ` · ${order.paymentProvider}` : ""}
                  </div>
                </td>
                <td style={td}>
                  <div>{order.customerName}</div>
                  <div style={{ opacity: 0.65 }}>{order.customerEmail}</div>
                </td>
                <td style={td}>{order.status}</td>
                <td style={td}>{order.paymentStatus}</td>
                <td style={td}>{formatEur(order.totalCents)}</td>
                <td style={td}>{order.createdAt.toISOString().slice(0, 19)}Z</td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td style={td} colSpan={6}>
                  No orders yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const th: CSSProperties = { padding: "0.65rem 0.4rem" };
const td: CSSProperties = { padding: "0.75rem 0.4rem", verticalAlign: "top" };
