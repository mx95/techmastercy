import { describe, expect, it } from "vitest";
import { consultationSchema } from "./validation";

describe("consultationSchema", () => {
  it("accepts a valid selector submission", () => {
    const parsed = consultationSchema.safeParse({
      name: "Alex Merchant",
      email: "alex@example.com",
      company: "Example Ltd",
      needs: ["ai-implementation", "business-automation"],
      problem: "We spend hours copying orders from the website into accounting every week.",
      systems: "WooCommerce, Excel",
      engagementType: "one-time",
      budgetRange: "500-1500",
      websiteConfirm: "",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects empty needs and short problem statements", () => {
    const parsed = consultationSchema.safeParse({
      name: "Alex",
      email: "alex@example.com",
      needs: [],
      problem: "Too short",
      systems: "X",
      engagementType: "ongoing",
      budgetRange: "not-sure",
    });
    expect(parsed.success).toBe(false);
  });
});
