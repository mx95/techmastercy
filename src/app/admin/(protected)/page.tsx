import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [products, published, orders, paidOrders, enquiries, newEnquiries] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "PUBLISHED" } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "PAID" } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "NEW" } }),
    ]);

  const cards = [
    { label: "Products", value: products, hint: `${published} published` },
    { label: "Orders", value: orders, hint: `${paidOrders} paid` },
    { label: "Enquiries", value: enquiries, hint: `${newEnquiries} new` },
  ];

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>
      <p style={{ opacity: 0.7 }}>Store and enquiry overview.</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "1rem",
          marginTop: "1.25rem",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              padding: "1.1rem 1.25rem",
              background: "#fff",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "0.85rem", opacity: 0.65 }}>{card.label}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.2 }}>
              {card.value}
            </div>
            <div style={{ fontSize: "0.85rem", opacity: 0.65 }}>{card.hint}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
