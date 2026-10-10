import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
  priceCents: z.number().int().min(0).max(10_000_000).optional(),
  stock: z.number().int().min(0).max(1_000_000).nullable().optional(),
});

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
}

export async function GET() {
  try {
    await requireAdminSession();
  } catch {
    return unauthorized();
  }

  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      category: true,
      licences: { orderBy: { sortOrder: "asc" } },
    },
  });

  return NextResponse.json({ products });
}

export async function PATCH(request: Request) {
  try {
    await requireAdminSession();
  } catch {
    return unauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id, ...updates } = parsed.data;
  if (
    updates.status === undefined &&
    updates.priceCents === undefined &&
    updates.stock === undefined
  ) {
    return NextResponse.json(
      { error: "No updatable fields provided." },
      { status: 400 },
    );
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: updates,
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }
}
