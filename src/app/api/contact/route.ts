import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendBusinessEmail } from "@/lib/email";
import { consumeRateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

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
  // Honeypot: pretend success without storing or emailing.
  if (typeof raw.websiteConfirm === "string" && raw.websiteConfirm.length > 0) {
    return NextResponse.json({
      ok: true,
      emailDelivered: false,
      emailNote: "Request accepted.",
    });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const ip = clientIp(request);
  const limit = await consumeRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many contact requests. Please try again later." },
      { status: 429 },
    );
  }

  const data = parsed.data;
  await prisma.enquiry.create({
    data: {
      name: data.name,
      email: data.email.toLowerCase(),
      company: data.company || null,
      website: data.website || null,
      service: data.service,
      paymentProvider: data.paymentProvider || null,
      description: data.description,
      preferredContact: data.preferredContact,
      honeypot: data.websiteConfirm || null,
    },
  });

  const emailResult = await sendBusinessEmail({
    subject: `New enquiry: ${data.service} — ${data.name}`,
    replyTo: data.email,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company || "—"}`,
      `Website: ${data.website || "—"}`,
      `Service: ${data.service}`,
      `Payment provider: ${data.paymentProvider || "—"}`,
      `Preferred contact: ${data.preferredContact}`,
      "",
      data.description,
    ].join("\n"),
  });

  return NextResponse.json({
    ok: true,
    emailDelivered: emailResult.sent,
    emailNote: emailResult.sent
      ? "Enquiry saved and email delivered."
      : emailResult.reason,
  });
}
