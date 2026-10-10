import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Enquiries</h1>
      <p style={{ opacity: 0.7 }}>Contact form submissions (up to 200).</p>
      <div style={{ display: "grid", gap: "0.85rem", marginTop: "1rem" }}>
        {enquiries.map((enquiry) => (
          <article
            key={enquiry.id}
            style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              padding: "1rem 1.1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <strong>
                {enquiry.name} · {enquiry.service}
              </strong>
              <span style={{ opacity: 0.65, fontSize: "0.85rem" }}>
                {enquiry.status} · {enquiry.createdAt.toISOString().slice(0, 19)}Z
              </span>
            </div>
            <div style={{ marginTop: "0.35rem", fontSize: "0.92rem", opacity: 0.8 }}>
              {enquiry.email}
              {enquiry.company ? ` · ${enquiry.company}` : ""}
              {enquiry.paymentProvider ? ` · ${enquiry.paymentProvider}` : ""}
            </div>
            <p style={{ margin: "0.65rem 0 0", whiteSpace: "pre-wrap" }}>
              {enquiry.description}
            </p>
          </article>
        ))}
        {enquiries.length === 0 ? <p>No enquiries yet.</p> : null}
      </div>
    </div>
  );
}
