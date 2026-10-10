import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBusinessEmail } from "@/lib/email";
import { consumeRateLimit } from "@/lib/rate-limit";
import { consultationSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const needLabels: Record<string, string> = {
  "ai-implementation": "AI implementation",
  "business-automation": "Business automation",
  "online-payments": "Online payments",
  "website-api-troubleshooting": "Website or API troubleshooting",
  "data-processing-reporting": "Data processing and reporting",
  "technical-consulting": "Technical consulting",
  "something-else": "Something else",
};

const engagementLabels: Record<string, string> = {
  "one-time": "One-time project",
  ongoing: "Ongoing support",
  "not-sure": "Not sure yet",
};

const budgetLabels: Record<string, string> = {
  "under-200": "Under €200",
  "200-500": "€200–€500",
  "500-1500": "€500–€1,500",
  "1500-plus": "€1,500+",
  "not-sure": "Not sure / prefer a recommendation",
};

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const raw = body as Record<string, unknown>;
  if (typeof raw.websiteConfirm === "string" && raw.websiteConfirm.length > 0) {
    return NextResponse.json({
      ok: true,
      emailDelivered: false,
      emailNote: "Request accepted.",
    });
  }

  const parsed = consultationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const ip = clientIp(request);
  const limit = await consumeRateLimit(`consultation:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  const data = parsed.data;
  const needsText = data.needs.map((n) => needLabels[n] || n).join(", ");
  const description = [
    "[Service selector consultation]",
    `Needs: ${needsText}`,
    `Engagement: ${engagementLabels[data.engagementType]}`,
    `Budget range: ${budgetLabels[data.budgetRange]}`,
    `Systems/tools: ${data.systems}`,
    "",
    "Problem:",
    data.problem,
  ].join("\n");

  await prisma.enquiry.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      company: data.company || null,
      service: "service-selector-consultation",
      description,
      preferredContact: "email",
      honeypot: data.websiteConfirm || null,
    },
  });

  const emailResult = await sendBusinessEmail({
    subject: `Consultation request — ${data.name}`,
    replyTo: data.email,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company || "—"}`,
      "",
      description,
    ].join("\n"),
  });

  return NextResponse.json({
    ok: true,
    emailDelivered: emailResult.sent,
    emailNote: emailResult.sent
      ? "Consultation request saved and email delivered."
      : emailResult.reason,
  });
}
