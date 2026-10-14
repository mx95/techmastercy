import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

/**
 * Crisp favicon from a clean geometric SVG of the Techmaster mark.
 * Matches emblem-black-on-white: T above a gap, M with vertical legs + deep V.
 */

const MARK_SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 208 284" width="1024" height="1396">
  <!-- T: beveled bar + short stem -->
  <path fill="#ffffff" d="
    M 44 2
    H 164
    L 204 46
    V 56
    H 126
    V 108
    H 82
    V 56
    H 4
    V 46
    Z
  "/>
  <!-- M: tall vertical legs, deep V notch, single bottom tip -->
  <path fill="#ffffff" fill-rule="evenodd" d="
    M 4 124
    H 204
    V 220
    L 104 282
    L 4 220
    Z

    M 54 124
    H 154
    L 104 214
    Z
  "/>
</svg>`;

fs.writeFileSync(
  path.join("public", "images", "brand", "emblem-mark.svg"),
  MARK_SVG,
);

async function circularIcon(size, fillRatio = 0.82) {
  const masterSize = 1024;
  const markBox = Math.round(masterSize * fillRatio);

  const mark = await sharp(Buffer.from(MARK_SVG), { density: 384 })
    .resize(markBox, markBox, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      kernel: sharp.kernel.lanczos3,
    })
    .png()
    .toBuffer();

  const circle = await sharp(
    Buffer.from(
      `<svg width="${masterSize}" height="${masterSize}" xmlns="http://www.w3.org/2000/svg"><circle cx="${masterSize / 2}" cy="${masterSize / 2}" r="${masterSize / 2}" fill="#0b1220"/></svg>`,
    ),
  )
    .png()
    .toBuffer();

  const master = await sharp({
    create: {
      width: masterSize,
      height: masterSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: circle, gravity: "centre" },
      { input: mark, gravity: "centre" },
    ])
    .png()
    .toBuffer();

  if (size === masterSize) return master;

  return sharp(master)
    .resize(size, size, { kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: size <= 32 ? 0.5 : 0.3, m1: 0.65, m2: 0.3 })
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

const master1024 = await circularIcon(1024, 0.82);
const icon16 = await circularIcon(16, 0.82);
const icon32 = await circularIcon(32, 0.82);
const icon48 = await circularIcon(48, 0.82);
const apple = await circularIcon(180, 0.82);

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

fs.writeFileSync(
  path.join("public", "images", "brand", "favicon-mark-preview.png"),
  await sharp(Buffer.from(MARK_SVG), { density: 384 })
    .resize(256, 256, {
      fit: "contain",
      background: { r: 11, g: 18, b: 32, alpha: 1 },
    })
    .png()
    .toBuffer(),
);

console.log("crisp T+M SVG favicons written");
