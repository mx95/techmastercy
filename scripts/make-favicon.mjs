import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Favicon from the same header emblem (emblem-black-on-white.png),
 * cropped to a circle with a slightly tighter trim so the mark fills more.
 * Does not modify header/logo components or the source emblem file.
 */

const SRC = path.join("public", "images", "brand", "emblem-black-on-white.png");
/** >1 zooms in before the circular mask (trims white margin). */
const TRIM_ZOOM = 1.28;

async function circularFromEmblem(size) {
  const masterSize = 1024;
  const zoomed = Math.round(masterSize * TRIM_ZOOM);

  // Zoom in on the emblem, then center-crop back to masterSize.
  const cropped = await sharp(SRC)
    .resize(zoomed, zoomed, {
      fit: "cover",
      position: "centre",
      kernel: sharp.kernel.lanczos3,
    })
    .extract({
      left: Math.round((zoomed - masterSize) / 2),
      top: Math.round((zoomed - masterSize) / 2),
      width: masterSize,
      height: masterSize,
    })
    .ensureAlpha()
    .png()
    .toBuffer();

  const circleMask = Buffer.from(
    `<svg width="${masterSize}" height="${masterSize}" xmlns="http://www.w3.org/2000/svg"><circle cx="${masterSize / 2}" cy="${masterSize / 2}" r="${masterSize / 2}" fill="#fff"/></svg>`,
  );

  const master = await sharp(cropped)
    .composite([
      {
        input: await sharp(circleMask).png().toBuffer(),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  if (size === masterSize) return master;

  return sharp(master)
    .resize(size, size, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: size <= 32 ? 0.45 : 0.25, m1: 0.6, m2: 0.3 })
    .png()
    .toBuffer();
}

async function writeIco(pngBuffers, sizes, outPath) {
  const count = pngBuffers.length;
  const headerSize = 6 + count * 16;
  let offset = headerSize;
  const dirs = [];
  for (let i = 0; i < count; i++) {
    dirs.push({ s: sizes[i], size: pngBuffers[i].length, offset });
    offset += pngBuffers[i].length;
  }
  const out = Buffer.alloc(offset);
  out.writeUInt16LE(0, 0);
  out.writeUInt16LE(1, 2);
  out.writeUInt16LE(count, 4);
  let dirPos = 6;
  for (const d of dirs) {
    out.writeUInt8(d.s >= 256 ? 0 : d.s, dirPos++);
    out.writeUInt8(d.s >= 256 ? 0 : d.s, dirPos++);
    out.writeUInt8(0, dirPos++);
    out.writeUInt8(0, dirPos++);
    out.writeUInt16LE(1, dirPos);
    dirPos += 2;
    out.writeUInt16LE(32, dirPos);
    dirPos += 2;
    out.writeUInt32LE(d.size, dirPos);
    dirPos += 4;
    out.writeUInt32LE(d.offset, dirPos);
    dirPos += 4;
  }
  for (let i = 0; i < count; i++) pngBuffers[i].copy(out, dirs[i].offset);
  fs.writeFileSync(outPath, out);
}

const master1024 = await circularFromEmblem(1024);
const icon16 = await circularFromEmblem(16);
const icon32 = await circularFromEmblem(32);
const icon48 = await circularFromEmblem(48);
const apple = await circularFromEmblem(180);

fs.writeFileSync(path.join("src", "app", "icon.png"), icon32);
fs.writeFileSync(path.join("src", "app", "apple-icon.png"), apple);
await writeIco(
  [icon16, icon32, icon48],
  [16, 32, 48],
  path.join("src", "app", "favicon.ico"),
);
await writeIco(
  [icon16, icon32, icon48],
  [16, 32, 48],
  path.join("public", "favicon.ico"),
);

fs.writeFileSync(
  path.join("public", "images", "brand", "favicon-circle-preview.png"),
  await sharp(master1024)
    .resize(256, 256, { kernel: sharp.kernel.lanczos3 })
    .png()
    .toBuffer(),
);

console.log("favicon from header emblem, tighter circular trim");
