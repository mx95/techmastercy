import { petpal } from "@/content/petpal";
import type { ProductCardData } from "@/lib/products";

/**
 * Catalogue items sold on partner sites (not TechmasterCY checkout).
 * Shown in the shop with an outbound link; carts stay separate.
 */
export type ExternalShopProduct = ProductCardData & {
  externalUrl: string;
  externalCta: string;
  sortOrder: number;
};

export const externalShopProducts: ExternalShopProduct[] = [
  {
    id: "external-petpal-gps-tracker",
    slug: "petpal-gps-tracker",
    name: "PetPal GPS Pet Tracker",
    shortDescription:
      "Know where your pet is—live location, history and routes in the PetPal app. Buy on PetPal Care Hub.",
    priceCents: 3999,
    compareAtCents: null,
    type: "PHYSICAL",
    images: ["/images/products/petpal/gps-tracker.jpg"],
    categorySlug: "trackers",
    categoryName: "Trackers",
    previewNote: "Checkout on PetPal Care Hub — separate cart and payments.",
    features: [
      "Live location in the PetPal app",
      "Location history and routes",
      "Collar-ready carbon-fibre tracker from €39.99",
    ],
    stock: null,
    externalUrl: petpal.shopUrl,
    externalCta: "Buy on PetPal",
    sortOrder: 15,
  },
];

export function getExternalShopProduct(
  slug: string,
): ExternalShopProduct | null {
  return externalShopProducts.find((product) => product.slug === slug) ?? null;
}

export function listExternalShopProducts(options?: {
  q?: string;
  category?: string;
  type?: "DIGITAL" | "PHYSICAL";
}): ExternalShopProduct[] {
  return externalShopProducts.filter((product) => {
    if (options?.type && product.type !== options.type) return false;
    if (options?.category && product.categorySlug !== options.category) {
      return false;
    }
    if (options?.q) {
      const q = options.q.trim().toLowerCase();
      if (!q) return true;
      const haystack = [
        product.name,
        product.shortDescription,
        product.previewNote ?? "",
        ...product.features,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}
