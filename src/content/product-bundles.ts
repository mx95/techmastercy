/**
 * Volume packs for catalogue products.
 * Exact pack quantities can set packTotalCents so checkout totals match
 * Revolut payment-link amounts (e.g. €11.99 / €19.99).
 */
export type ProductVolumePack = {
  quantity: number;
  label: string;
  /** Display / fallback unit price in euro cents. */
  unitPriceCents: number;
  /**
   * Exact line total for this pack quantity (preferred when set).
   * Use when unit × qty would not land on the Revolut link amount.
   */
  packTotalCents?: number;
  badge?: string;
};

export type ProductBundleConfig = {
  heading: string;
  packs: ProductVolumePack[];
};

const bundlesBySlug: Record<string, ProductBundleConfig> = {
  "mini-airtag-finder": {
    heading: "Buy in bulk",
    packs: [
      {
        quantity: 1,
        label: "Buy 1",
        unitPriceCents: 699,
        packTotalCents: 699,
      },
      {
        quantity: 2,
        label: "Buy 2",
        unitPriceCents: 600,
        packTotalCents: 1199,
        badge: "Popular",
      },
      {
        quantity: 4,
        label: "Buy 4",
        unitPriceCents: 500,
        packTotalCents: 1999,
        badge: "Best value",
      },
    ],
  },
};

export function getProductVolumeBundles(
  slug: string,
): ProductBundleConfig | null {
  return bundlesBySlug[slug] ?? null;
}

export function getExactVolumePack(
  slug: string,
  quantity: number,
): ProductVolumePack | null {
  const config = bundlesBySlug[slug];
  if (!config?.packs.length) return null;
  const qty = Math.max(1, Math.floor(quantity));
  return config.packs.find((pack) => pack.quantity === qty) ?? null;
}

/**
 * Resolve unit price for a product + quantity.
 * Exact pack quantities use pack rates; other quantities use the best
 * tier that the quantity unlocks (2–3 → pack-of-2 rate, 4+ → pack-of-4).
 */
export function resolveVolumeUnitPrice(
  slug: string,
  quantity: number,
  fallbackPriceCents: number,
): number {
  const config = bundlesBySlug[slug];
  if (!config?.packs.length) return fallbackPriceCents;

  const qty = Math.max(1, Math.floor(quantity));
  const packs = [...config.packs].sort((a, b) => b.quantity - a.quantity);
  const exact = packs.find((pack) => pack.quantity === qty);
  if (exact) return exact.unitPriceCents;

  const tier = packs.find((pack) => qty >= pack.quantity);
  return tier?.unitPriceCents ?? fallbackPriceCents;
}

/** Line total in cents for cart/checkout (exact pack totals when configured). */
export function resolveVolumeLineTotal(
  slug: string,
  quantity: number,
  fallbackPriceCents: number,
): number {
  const qty = Math.max(1, Math.floor(quantity));
  const exact = getExactVolumePack(slug, qty);
  if (exact?.packTotalCents != null) return exact.packTotalCents;
  return resolveVolumeUnitPrice(slug, qty, fallbackPriceCents) * qty;
}

export function packDisplayTotal(pack: ProductVolumePack): number {
  return pack.packTotalCents ?? pack.unitPriceCents * pack.quantity;
}
