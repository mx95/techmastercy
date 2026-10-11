import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = path.join("public", "images", "brand", "emblem-black-on-white.png");

async function circularIcon(size, logoRatio = 0.56) {
  const logoSize = Math.round(size * logoRatio);
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (brightness > 230) data[i + 3] = 0;
  }

  const cutout = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .resize(logoSize, logoSize, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer();

  const circleSvg = Buffer.from(
    `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff"/></svg>`,
  );

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: await sharp(circleSvg).png().toBuffer(), gravity: "centre" },
      { input: cutout, gravity: "centre" },
    ])
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

const icon16 = await circularIcon(16, 0.52);
const icon32 = await circularIcon(32, 0.48);
const icon48 = await circularIcon(48, 0.48);
const apple = await circularIcon(180, 0.48);

fs.writeFileSync(path.join("src", "app", "icon.png"), icon32);
fs.writeFileSync(path.join("src", "app", "apple-icon.png"), apple);
await writeIco([icon16, icon32, icon48], [16, 32, 48], path.join("src", "app", "favicon.ico"));
await writeIco([icon16, icon32, icon48], [16, 32, 48], path.join("public", "favicon.ico"));
fs.writeFileSync(
  path.join("public", "images", "brand", "favicon-circle-preview.png"),
  await circularIcon(64, 0.56),
);
console.log("circular favicons written");
