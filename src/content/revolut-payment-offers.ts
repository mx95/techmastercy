/**
 * Static Revolut Pro payment-link offers.
 * Each offer matches an exact cart composition (product slug + quantity).
 * Put the real Revolut link URLs in the matching env vars (see .env.example).
 *
 * Carts that do not match any offer use the deferred flow:
 * order is stored and a payment link is sent later by email/phone.
 */

export type RevolutOfferItem = {
  /** Product slug from the catalogue */
  slug: string;
  quantity: number;
};

export type RevolutPaymentOffer = {
  id: string;
  /** Shown on checkout when this offer matches */
  label: string;
  /** Exact line items required (order-insensitive) */
  items: RevolutOfferItem[];
  /** Env var holding the Revolut Pro payment-link URL */
  urlEnv: string;
};

/**
 * Predefined single-product and combo offers for the live catalogue.
 * Add more rows here when you create matching Revolut Pro links.
 */
export const revolutPaymentOffers: RevolutPaymentOffer[] = [
  {
    id: "ottocast-1",
    label: "Ottocast Cabin Care × 1",
    items: [{ slug: "ottocast-cabin-care", quantity: 1 }],
    urlEnv: "REVOLUT_LINK_OTTOCAST_1",
  },
  {
    id: "airtag-1",
    label: "Mini AirTag Finder × 1",
    items: [{ slug: "mini-airtag-finder", quantity: 1 }],
    urlEnv: "REVOLUT_LINK_AIRTAG_1",
  },
  {
    id: "airtag-2",
    label: "Mini AirTag Finder × 2",
    items: [{ slug: "mini-airtag-finder", quantity: 2 }],
    urlEnv: "REVOLUT_LINK_AIRTAG_2",
  },
  {
    id: "airtag-4",
    label: "Mini AirTag Finder × 4",
    items: [{ slug: "mini-airtag-finder", quantity: 4 }],
    urlEnv: "REVOLUT_LINK_AIRTAG_4",
  },
  {
    id: "ottocast-airtag-1",
    label: "Ottocast Cabin Care × 1 + Mini AirTag Finder × 1",
    items: [
      { slug: "ottocast-cabin-care", quantity: 1 },
      { slug: "mini-airtag-finder", quantity: 1 },
    ],
    urlEnv: "REVOLUT_LINK_OTTOCAST_AIRTAG_1",
  },
  {
    id: "ottocast-airtag-2",
    label: "Ottocast Cabin Care × 1 + Mini AirTag Finder × 2",
    items: [
      { slug: "ottocast-cabin-care", quantity: 1 },
      { slug: "mini-airtag-finder", quantity: 2 },
    ],
    urlEnv: "REVOLUT_LINK_OTTOCAST_AIRTAG_2",
  },
];

export const revolutDeferredPaymentMessage =
  "This cart does not match a ready-made Revolut payment link. We will send a personal payment link to your email or phone shortly after you place the order.";

/** Stable fingerprint: "slug:qty|slug:qty" sorted by slug */
export function cartFingerprint(
  items: Array<{ slug: string; quantity: number }>,
): string {
  return [...items]
    .map((item) => ({
      slug: item.slug.trim().toLowerCase(),
      quantity: Math.max(1, Math.floor(item.quantity)),
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map((item) => `${item.slug}:${item.quantity}`)
    .join("|");
}

export function findRevolutOffer(
  items: Array<{ slug: string; quantity: number }>,
): RevolutPaymentOffer | null {
  const fingerprint = cartFingerprint(items);
  return (
    revolutPaymentOffers.find(
      (offer) => cartFingerprint(offer.items) === fingerprint,
    ) ?? null
  );
}

export function getRevolutOfferUrl(offer: RevolutPaymentOffer): string | null {
  const raw = process.env[offer.urlEnv]?.trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    return url.toString();
  } catch {
    return null;
  }
}
