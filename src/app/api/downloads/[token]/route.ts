import { createReadStream, existsSync, statSync } from "fs";
import path from "path";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { getDownloadConfig } from "@/lib/config";
import { prisma } from "@/lib/db";
import { hashDownloadToken } from "@/lib/orders";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ token: string }>;
};

function privateRoot(): string {
  const configured = getDownloadConfig().privateDir;
  if (path.isAbsolute(configured)) {
    return path.resolve(/*turbopackIgnore: true*/ configured);
  }
  // Scope relative dirs under cwd/storage when possible to satisfy bundler tracing.
  const normalized = configured.replace(/^\.\//, "");
  if (normalized === "storage/private" || normalized.startsWith("storage/private/")) {
    return path.join(process.cwd(), "storage", "private");
  }
  return path.join(/*turbopackIgnore: true*/ process.cwd(), normalized);
}

function resolveSafePath(root: string, storagePath: string): string | null {
  const resolved = path.resolve(root, storagePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    return null;
  }
  return resolved;
}

export async function GET(_request: Request, context: RouteContext) {
  const { token } = await context.params;
  if (!token || token.length < 16) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const tokenHash = hashDownloadToken(token);
  const record = await prisma.downloadToken.findUnique({
    where: { tokenHash },
    include: {
      order: true,
      downloadFile: true,
    },
  });

  if (!record || !record.downloadFile.active) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (record.expiresAt.getTime() < Date.now()) {
    return NextResponse.json({ error: "Download link expired." }, { status: 403 });
  }

  if (record.downloadCount >= record.maxDownloads) {
    return NextResponse.json(
      { error: "Download limit reached." },
      { status: 403 },
    );
  }

  if (
    record.order.status !== "PAID" &&
    record.order.paymentStatus !== "CAPTURED"
  ) {
    return NextResponse.json(
      { error: "Order is not paid." },
      { status: 403 },
    );
  }

  const root = privateRoot();
  const absolute = resolveSafePath(root, record.downloadFile.storagePath);
  if (
    !absolute ||
    !existsSync(/*turbopackIgnore: true*/ absolute) ||
    !statSync(/*turbopackIgnore: true*/ absolute).isFile()
  ) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  await prisma.downloadToken.update({
    where: { id: record.id },
    data: {
      downloadCount: { increment: 1 },
      lastDownloadAt: new Date(),
    },
  });

  const nodeStream = createReadStream(/*turbopackIgnore: true*/ absolute);
  const webStream = Readable.toWeb(nodeStream) as ReadableStream;

  const filename =
    path.basename(record.downloadFile.storagePath) ||
    record.downloadFile.label.replace(/[^\w.-]+/g, "_");

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Type": record.downloadFile.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
