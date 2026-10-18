import { describe, expect, it } from "vitest";
import {
  cartFingerprint,
  findRevolutOffer,
} from "@/content/revolut-payment-offers";

describe("revolut payment offer matching", () => {
  it("matches single airtag pack", () => {
    const offer = findRevolutOffer([
      { slug: "mini-airtag-finder", quantity: 2 },
    ]);
    expect(offer?.id).toBe("airtag-2");
  });

  it("matches combo regardless of line order", () => {
    const offer = findRevolutOffer([
      { slug: "mini-airtag-finder", quantity: 1 },
      { slug: "ottocast-cabin-care", quantity: 1 },
    ]);
    expect(offer?.id).toBe("ottocast-airtag-1");
  });

  it("defers unmatched carts", () => {
    expect(
      findRevolutOffer([{ slug: "mini-airtag-finder", quantity: 3 }]),
    ).toBeNull();
  });

  it("builds stable fingerprints", () => {
    expect(
      cartFingerprint([
        { slug: "b", quantity: 1 },
        { slug: "a", quantity: 2 },
      ]),
    ).toBe("a:2|b:1");
  });
});
