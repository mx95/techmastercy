import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@techmaster.com.cy";
  const adminPassword = process.env.ADMIN_PASSWORD || "ChangeMeImmediately1!";

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "TechmasterCY Admin",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  const carTech = await prisma.category.upsert({
    where: { slug: "car-tech" },
    update: { name: "Car tech", description: "In-car cameras, adapters and accessories." },
    create: {
      slug: "car-tech",
      name: "Car tech",
      description: "In-car cameras, adapters and accessories.",
      sortOrder: 1,
    },
  });

  const trackers = await prisma.category.upsert({
    where: { slug: "trackers" },
    update: { name: "Trackers", description: "Smart finders and anti-lost devices." },
    create: {
      slug: "trackers",
      name: "Trackers",
      description: "Smart finders and anti-lost devices.",
      sortOrder: 2,
    },
  });

  const developerTools = await prisma.category.upsert({
    where: { slug: "developer-tools" },
    update: {
      name: "Developer tools",
      description: "Integration kits, templates and technical documentation.",
    },
    create: {
      slug: "developer-tools",
      name: "Developer tools",
      description: "Integration kits, templates and technical documentation.",
      sortOrder: 3,
    },
  });

  await prisma.product.upsert({
    where: { slug: "ottocast-cabin-care" },
    update: {
      name: "Ottocast Cabin Care – Camera + Wireless Apple CarPlay",
      shortDescription:
        "2-in-1 cabin camera and wireless Apple CarPlay adapter for cars with wired CarPlay.",
      description: [
        "Upgrade your car with one smart device: a cabin camera for monitoring passengers and a wireless Apple CarPlay adapter so you can leave the cable behind.",
        "",
        "Simply plug it in and your iPhone can connect wirelessly when you start the car (compatible with vehicles that already have wired CarPlay).",
        "",
        "Highlights:",
        "- 2-in-1: cabin camera + wireless CarPlay",
        "- Plug & play setup with strap or headrest-rod clip mounting",
        "- 150° wide view and night vision for clearer back-seat monitoring",
        "- Split-screen / picture-in-picture friendly viewing on supported head units",
        "- Privacy-focused live view without storing or uploading footage on the device workflow described by the manufacturer materials",
        "",
        "Important before you buy:",
        "- Works with vehicles that have wired CarPlay",
        "- Camera monitoring is designed for iPhone / CarPlay workflows as described in the product materials",
        "",
        "Prices match the current TechmasterCY Shopify listing (€89.99, was €124.99).",
      ].join("\n"),
      priceCents: 8999,
      compareAtCents: 12499,
      status: "PUBLISHED",
      type: "PHYSICAL",
      requiresShipping: true,
      stock: 0,
      categoryId: carTech.id,
      features: JSON.stringify([
        "Cabin camera + wireless Apple CarPlay",
        "150° wide-angle view",
        "Night vision monitoring",
        "Strap or clip mounting",
        "Plug & play USB receiver",
      ]),
      images: JSON.stringify([
        "/images/products/ottocast/otto1.png",
        "/images/products/ottocast/otto2.png",
        "/images/products/ottocast/otto3.png",
        "/images/products/ottocast/otto4.png",
        "/images/products/ottocast/otto5.png",
        "/images/products/ottocast/otto6.png",
        "/images/products/ottocast/otto7.png",
        "/images/products/ottocast/otto8.png",
        "/images/products/ottocast/otto9.png",
        "/images/products/ottocast/otto10.png",
        "/images/products/ottocast/otto11.png",
        "/images/products/ottocast/otto12.png",
      ]),
      sortOrder: 1,
    },
    create: {
      slug: "ottocast-cabin-care",
      name: "Ottocast Cabin Care – Camera + Wireless Apple CarPlay",
      shortDescription:
        "2-in-1 cabin camera and wireless Apple CarPlay adapter for cars with wired CarPlay.",
      description: [
        "Upgrade your car with one smart device: a cabin camera for monitoring passengers and a wireless Apple CarPlay adapter so you can leave the cable behind.",
        "",
        "Simply plug it in and your iPhone can connect wirelessly when you start the car (compatible with vehicles that already have wired CarPlay).",
        "",
        "Highlights:",
        "- 2-in-1: cabin camera + wireless CarPlay",
        "- Plug & play setup with strap or headrest-rod clip mounting",
        "- 150° wide view and night vision for clearer back-seat monitoring",
        "- Split-screen / picture-in-picture friendly viewing on supported head units",
        "- Privacy-focused live view without storing or uploading footage on the device workflow described by the manufacturer materials",
        "",
        "Important before you buy:",
        "- Works with vehicles that have wired CarPlay",
        "- Camera monitoring is designed for iPhone / CarPlay workflows as described in the product materials",
        "",
        "Prices match the current TechmasterCY Shopify listing (€89.99, was €124.99).",
      ].join("\n"),
      priceCents: 8999,
      compareAtCents: 12499,
      status: "PUBLISHED",
      type: "PHYSICAL",
      requiresShipping: true,
      stock: 0,
      sku: "OTTO-CABIN-CARE",
      categoryId: carTech.id,
      features: JSON.stringify([
        "Cabin camera + wireless Apple CarPlay",
        "150° wide-angle view",
        "Night vision monitoring",
        "Strap or clip mounting",
        "Plug & play USB receiver",
      ]),
      images: JSON.stringify([
        "/images/products/ottocast/otto1.png",
        "/images/products/ottocast/otto2.png",
        "/images/products/ottocast/otto3.png",
        "/images/products/ottocast/otto4.png",
        "/images/products/ottocast/otto5.png",
        "/images/products/ottocast/otto6.png",
        "/images/products/ottocast/otto7.png",
        "/images/products/ottocast/otto8.png",
        "/images/products/ottocast/otto9.png",
        "/images/products/ottocast/otto10.png",
        "/images/products/ottocast/otto11.png",
        "/images/products/ottocast/otto12.png",
      ]),
      sortOrder: 1,
    },
  });

  await prisma.product.upsert({
    where: { slug: "mini-airtag-finder" },
    update: {
      name: "Mini AirTag Finder – iOS and Android dual system",
      shortDescription:
        "Compact smart finder compatible with Apple Find My and Android Find Hub networks.",
      description: [
        "A compact anti-lost tracker designed for everyday items. Works with Apple Find My and Android Find Hub ecosystems as indicated by the product badges.",
        "",
        "Highlights from the product materials:",
        "- Wide compatibility: Apple Find My and Android Find Hub",
        "- Focus on stable, accurate locating with LENZE chipset materials stated by the supplier",
        "- Ultra-low power consumption to extend battery life",
        "- No separate app download required for the built-in binding flow described by the manufacturer",
        "",
        "Price matches the current TechmasterCY Shopify listing (€4.99).",
      ].join("\n"),
      priceCents: 499,
      compareAtCents: null,
      status: "PUBLISHED",
      type: "PHYSICAL",
      requiresShipping: true,
      stock: 25,
      categoryId: trackers.id,
      features: JSON.stringify([
        "Works with Apple Find My",
        "Works with Android Find Hub",
        "Compact circular design",
        "Low power consumption",
      ]),
      images: JSON.stringify([
        "/images/products/airtag/air1.png",
        "/images/products/airtag/air2.png",
      ]),
      sortOrder: 2,
    },
    create: {
      slug: "mini-airtag-finder",
      name: "Mini AirTag Finder – iOS and Android dual system",
      shortDescription:
        "Compact smart finder compatible with Apple Find My and Android Find Hub networks.",
      description: [
        "A compact anti-lost tracker designed for everyday items. Works with Apple Find My and Android Find Hub ecosystems as indicated by the product badges.",
        "",
        "Highlights from the product materials:",
        "- Wide compatibility: Apple Find My and Android Find Hub",
        "- Focus on stable, accurate locating with LENZE chipset materials stated by the supplier",
        "- Ultra-low power consumption to extend battery life",
        "- No separate app download required for the built-in binding flow described by the manufacturer",
        "",
        "Price matches the current TechmasterCY Shopify listing (€4.99).",
      ].join("\n"),
      priceCents: 499,
      compareAtCents: null,
      status: "PUBLISHED",
      type: "PHYSICAL",
      requiresShipping: true,
      stock: 25,
      sku: "FINDER-MINI-DUAL",
      categoryId: trackers.id,
      features: JSON.stringify([
        "Works with Apple Find My",
        "Works with Android Find Hub",
        "Compact circular design",
        "Low power consumption",
      ]),
      images: JSON.stringify([
        "/images/products/airtag/air1.png",
        "/images/products/airtag/air2.png",
      ]),
      sortOrder: 2,
    },
  });

  const webhookKit = await prisma.product.upsert({
    where: { slug: "webhook-reliability-kit" },
    update: {
      name: "Webhook Reliability Kit (Java / Spring Boot)",
      shortDescription:
        "Draft digital kit for webhook verification, idempotency, retries and testing. Unpublished until product files are ready.",
      description: [
        "Planned contents (draft — not available for purchase until files are packaged and tested):",
        "- Runnable Spring Boot webhook receiver",
        "- Signature verification examples",
        "- Idempotency and duplicate-event handling",
        "- Retry and failure-handling examples",
        "- Postman collections and sample payloads",
        "- Automated tests for common webhook scenarios",
        "- Logging, monitoring and deployment guidance",
        "- Troubleshooting guide",
        "",
        "Proposed licence pricing (configurable, not market-validated):",
        "- Individual developer licence: €49",
        "- Small team licence: €149",
        "",
        "This product remains in DRAFT until real downloadable archives exist.",
      ].join("\n"),
      priceCents: 4900,
      status: "DRAFT",
      type: "DIGITAL",
      requiresShipping: false,
      categoryId: developerTools.id,
      previewNote:
        "Preview only — unpublished draft. No downloadable files are available yet.",
      features: JSON.stringify([
        "Spring Boot webhook receiver (planned)",
        "Signature verification examples (planned)",
        "Idempotency patterns (planned)",
        "Postman collections (planned)",
      ]),
      images: JSON.stringify(["/images/products/webhook-kit-preview.svg"]),
      sortOrder: 10,
    },
    create: {
      slug: "webhook-reliability-kit",
      name: "Webhook Reliability Kit (Java / Spring Boot)",
      shortDescription:
        "Draft digital kit for webhook verification, idempotency, retries and testing. Unpublished until product files are ready.",
      description: [
        "Planned contents (draft — not available for purchase until files are packaged and tested):",
        "- Runnable Spring Boot webhook receiver",
        "- Signature verification examples",
        "- Idempotency and duplicate-event handling",
        "- Retry and failure-handling examples",
        "- Postman collections and sample payloads",
        "- Automated tests for common webhook scenarios",
        "- Logging, monitoring and deployment guidance",
        "- Troubleshooting guide",
        "",
        "Proposed licence pricing (configurable, not market-validated):",
        "- Individual developer licence: €49",
        "- Small team licence: €149",
        "",
        "This product remains in DRAFT until real downloadable archives exist.",
      ].join("\n"),
      priceCents: 4900,
      status: "DRAFT",
      type: "DIGITAL",
      requiresShipping: false,
      sku: "DIGITAL-WEBHOOK-KIT",
      categoryId: developerTools.id,
      previewNote:
        "Preview only — unpublished draft. No downloadable files are available yet.",
      features: JSON.stringify([
        "Spring Boot webhook receiver (planned)",
        "Signature verification examples (planned)",
        "Idempotency patterns (planned)",
        "Postman collections (planned)",
      ]),
      images: JSON.stringify(["/images/products/webhook-kit-preview.svg"]),
      sortOrder: 10,
    },
  });

  await prisma.licenceOption.deleteMany({ where: { productId: webhookKit.id } });
  await prisma.licenceOption.createMany({
    data: [
      {
        productId: webhookKit.id,
        code: "individual",
        name: "Individual developer licence",
        description: "For a single developer. Proposed starting price.",
        priceCents: 4900,
        maxSeats: 1,
        sortOrder: 1,
      },
      {
        productId: webhookKit.id,
        code: "team",
        name: "Small team licence",
        description: "For a small team. Proposed starting price.",
        priceCents: 14900,
        maxSeats: 5,
        sortOrder: 2,
      },
    ],
  });

  console.log("Seed complete.");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
