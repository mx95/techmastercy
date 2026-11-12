import { describe, expect, it } from "vitest";
import { getServicePillar, servicePillars } from "@/content/service-pillars";
import { getService } from "@/content/services";

describe("service pillars", () => {
  it("exposes four public pillars with resolvable service links", () => {
    expect(servicePillars).toHaveLength(4);
    expect(getServicePillar("payment-solutions")?.featured).toBe(true);

    for (const pillar of servicePillars) {
      expect(pillar.slug).toBeTruthy();
      expect(pillar.serviceSlugs.length).toBeGreaterThan(0);
      for (const slug of pillar.serviceSlugs) {
        expect(getService(slug), `missing service ${slug}`).toBeTruthy();
      }
    }
  });
});
