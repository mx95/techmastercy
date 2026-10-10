import { afterEach, describe, expect, it, vi } from "vitest";
import { MockPaymentProvider } from "@/lib/payments/mock-provider";

describe("MockPaymentProvider", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("blocks in production when ALLOW_MOCK_PAYMENTS is not true", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PAYMENT_PROVIDER", "mock");
    vi.stubEnv("ALLOW_MOCK_PAYMENTS", "false");

    const provider = new MockPaymentProvider();
    await expect(
      provider.createCheckoutSession({
        orderId: "ord_1",
        orderReference: "TMC-TEST",
        amountCents: 1000,
        currency: "EUR",
        customer: { email: "a@b.com", name: "A" },
        returnUrl: "http://localhost/ok",
        cancelUrl: "http://localhost/cancel",
      }),
    ).rejects.toThrow(/disabled|not allowed|Mock/i);
  });

  it("creates a mock redirect session when allowed", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("PAYMENT_PROVIDER", "mock");
    vi.stubEnv("ALLOW_MOCK_PAYMENTS", "true");
    vi.stubEnv("APP_URL", "http://localhost:3000");

    const provider = new MockPaymentProvider();
    const session = await provider.createCheckoutSession({
      orderId: "ord_1",
      orderReference: "TMC-TEST",
      amountCents: 1000,
      currency: "EUR",
      customer: { email: "a@b.com", name: "A" },
      returnUrl: "http://localhost/ok",
      cancelUrl: "http://localhost/cancel",
    });

    expect(session.provider).toBe("mock");
    expect(session.providerRef).toMatch(/^mock_/);
    expect(session.redirectUrl).toContain("/api/payments/mock/complete");
    expect(session.redirectUrl).toContain("order=TMC-TEST");
  });
});
