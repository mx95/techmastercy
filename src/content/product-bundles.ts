/**
 * Volume packs for catalogue products (parity with Shopify Bundler tiers).
 */
export type ProductVolumePack = {
  quantity: number;
  label: string;
  /** Unit price in euro cents for this pack quantity. */
  unitPriceCents: number;
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
      { quantity: 1, label: "Buy 1", unitPriceCents: 799 },
      {
        quantity: 2,
        label: "Buy 2",
        unitPriceCents: 599,
        badge: "Popular",
      },
      {
        quantity: 4,
        label: "Buy 4",
        unitPriceCents: 499,
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
