import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/config";

describe("contact consistency", () => {
  it("uses a single primary business enquiry email", () => {
    expect(siteConfig.businessEmail).toBe("support@techmaster.com.cy");
    expect(siteConfig.businessEmail).toMatch(/@techmaster\.com\.cy$/);
  });
});
