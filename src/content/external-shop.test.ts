import { describe, expect, it } from "vitest";
import {
  getExternalShopProduct,
  listExternalShopProducts,
} from "@/content/external-shop";

describe("external shop catalogue", () => {
  it("lists the PetPal GPS tracker with a petpal.com.cy shop link", () => {
    const product = getExternalShopProduct("petpal-gps-tracker");
    expect(product).not.toBeNull();
    expect(product?.externalUrl).toBe("https://petpal.com.cy/shop");
    expect(product?.priceCents).toBe(3999);
    expect(product?.externalCta).toMatch(/PetPal/i);
    expect(product?.images[0]).toContain("gps-collar-tracker");
  });

  it("filters by query and category", () => {
    expect(listExternalShopProducts({ q: "gps" })).toHaveLength(1);
    expect(listExternalShopProducts({ q: "ottocast" })).toHaveLength(0);
    expect(listExternalShopProducts({ category: "trackers" })).toHaveLength(1);
    expect(listExternalShopProducts({ category: "car-tech" })).toHaveLength(0);
  });
});
