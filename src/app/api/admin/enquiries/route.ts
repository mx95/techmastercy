import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["NEW", "IN_PROGRESS", "CLOSED"]),
});

export async function GET(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() || "";
  const status = searchParams.get("status")?.trim() || "";

  const enquiries = await prisma.enquiry.findMany({
    where: {
      AND: [
        status && ["NEW", "IN_PROGRESS", "CLOSED"].includes(status)
          ? { status: status as "NEW" | "IN_PROGRESS" | "CLOSED" }
          : {},
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

  return NextResponse.json({ enquiries });
}

export async function PATCH(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed." }, { status: 400 });
  }

  const enquiry = await prisma.enquiry.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ enquiry });
}
