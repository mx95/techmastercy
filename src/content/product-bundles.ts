/**
 * Volume packs mirrored from the live Shopify Bundler widget
 * (techmaster.com.cy Mini AirTag Finder product).
 *
 * Totals are quantity × unit price (Shopify currently shows the same).
 * Savings copy from Bundler used a non-matching compare baseline, so we
 * surface pack totals without inventing a discount.
 */
export type ProductVolumePack = {
  quantity: number;
  label: string;
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
      { quantity: 1, label: "Buy 1" },
      { quantity: 2, label: "Buy 2", badge: "Popular" },
      { quantity: 4, label: "Buy 4", badge: "Best value" },
    ],
  },
};

export function getProductVolumeBundles(
  slug: string,
): ProductBundleConfig | null {
  return bundlesBySlug[slug] ?? null;
}
