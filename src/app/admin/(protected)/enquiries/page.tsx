import { EnquiryStatusSelect } from "@/app/admin/(protected)/enquiries/enquiry-actions";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string; status?: string }>;

export default async function AdminEnquiriesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const status =
    params.status === "NEW" ||
    params.status === "IN_PROGRESS" ||
    params.status === "CLOSED"
      ? params.status
      : "";

  const enquiries = await prisma.enquiry.findMany({
    where: {
      AND: [
        status ? { status } : {},
        q
          ? {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } },
                { company: { contains: q } },
                { service: { contains: q } },
                { description: { contains: q } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Enquiries</h1>
      <p style={{ opacity: 0.7 }}>Contact form submissions (up to 200). Status updates are saved server-side.</p>

      <form
        method="get"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginTop: "1rem",
          alignItems: "end",
        }}
      >
        <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.85rem" }}>
          Search
          <input
            name="q"
            defaultValue={q}
            placeholder="Name, email, service…"
            style={{ padding: "0.45rem 0.6rem", minWidth: 220 }}
          />
        </label>
        <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.85rem" }}>
          Status
          <select name="status" defaultValue={status} style={{ padding: "0.45rem 0.6rem" }}>
            <option value="">All</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="CLOSED">Resolved</option>
          </select>
        </label>
        <button type="submit" style={{ padding: "0.5rem 0.9rem" }}>
          Filter
        </button>
      </form>

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
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <strong>
                {enquiry.name} · {enquiry.service}
              </strong>
              <EnquiryStatusSelect id={enquiry.id} status={enquiry.status} />
            </div>
            <div style={{ marginTop: "0.35rem", fontSize: "0.92rem", opacity: 0.8 }}>
              {enquiry.email}
              {enquiry.company ? ` · ${enquiry.company}` : ""}
              {enquiry.paymentProvider ? ` · ${enquiry.paymentProvider}` : ""}
              {" · "}
              {enquiry.createdAt.toISOString().slice(0, 19)}Z
            </div>
            <p style={{ margin: "0.65rem 0 0", whiteSpace: "pre-wrap" }}>
              {enquiry.description}
            </p>
          </article>
        ))}
        {enquiries.length === 0 ? <p>No enquiries match these filters.</p> : null}
      </div>
    </div>
  );
}
