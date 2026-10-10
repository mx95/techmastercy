function requiredInProduction(name: string, value: string | undefined): string {
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? "";
}

export const siteConfig = {
  name: "TechmasterCY",
  legalName: "TechmasterCY",
  domain: "techmaster.com.cy",
  url: process.env.SITE_URL || "https://techmaster.com.cy",
  appUrl: process.env.APP_URL || "http://localhost:3000",
  locale: "en",
  currency: "EUR" as const,
  businessEmail: process.env.BUSINESS_EMAIL || "hello@techmaster.com.cy",
  description:
    "Payment gateway integration, JCC workflows, practical AI and business automation, technical support, and developer tools for businesses in Cyprus.",
  keywords: [
    "Payment gateway integration Cyprus",
    "JCC payment integration Cyprus",
    "WooCommerce payment integration Cyprus",
    "Shopify payment integration Cyprus",
    "Custom online payment integration",
    "Online payment troubleshooting Cyprus",
    "Webhook integration and testing tools",
    "AI consulting Cyprus",
    "Business process automation Cyprus",
  ],
};

export function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be at least 32 characters in production");
    }
    return "dev-only-change-me-to-a-long-random-secret-value-32chars";
  }
  return secret;
}

export function getPaymentProviderName(): "mock" | "jcc" {
  const name = (process.env.PAYMENT_PROVIDER || "mock").toLowerCase();
  if (name === "jcc") return "jcc";
  return "mock";
}

export function isMockPaymentsAllowed(): boolean {
  if (getPaymentProviderName() !== "mock") return false;
  if (process.env.NODE_ENV !== "production") return true;
  return process.env.ALLOW_MOCK_PAYMENTS === "true";
}

export function getTaxConfig() {
  return {
    rateBps: Number(process.env.TAX_RATE_BPS || "1900"),
    inclusive: (process.env.TAX_INCLUSIVE || "true") === "true",
  };
}

export function getDownloadConfig() {
  return {
    ttlHours: Number(process.env.DOWNLOAD_TOKEN_TTL_HOURS || "72"),
    maxAttempts: Number(process.env.DOWNLOAD_MAX_ATTEMPTS || "5"),
    privateDir: process.env.PRIVATE_FILES_DIR || "./storage/private",
  };
}

export function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  if (!host) return null;
  return {
    host,
    port: Number(process.env.SMTP_PORT || "587"),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.SMTP_FROM || siteConfig.businessEmail,
  };
}

export function getJccConfig() {
  return {
    merchantId: requiredInProduction("JCC_MERCHANT_ID", process.env.JCC_MERCHANT_ID),
    apiKey: process.env.JCC_API_KEY || "",
    apiSecret: process.env.JCC_API_SECRET || "",
    baseUrl: process.env.JCC_BASE_URL || "",
    webhookSecret: process.env.JCC_WEBHOOK_SECRET || "",
  };
}
