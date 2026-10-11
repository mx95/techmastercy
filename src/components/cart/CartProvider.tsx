"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { resolveVolumeUnitPrice } from "@/content/product-bundles";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPriceCents: number;
  licenceOptionId?: string;
  licenceName?: string;
  quantity: number;
  type: "DIGITAL" | "PHYSICAL";
};

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  itemCount: number;
  subtotalCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartLine, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (productId: string, quantity: number, licenceOptionId?: string) => void;
  removeItem: (productId: string, licenceOptionId?: string) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "tmc_cart_v1";
const EMPTY_CART: CartLine[] = [];

const CartContext = createContext<CartContextValue | null>(null);

let cachedRaw: string | null = null;
let cachedLines: CartLine[] = EMPTY_CART;

function lineKey(productId: string, licenceOptionId?: string) {
  return `${productId}::${licenceOptionId || ""}`;
}

function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const line = value as CartLine;
  return (
    typeof line.productId === "string" &&
    typeof line.slug === "string" &&
    typeof line.name === "string" &&
    typeof line.image === "string" &&
    typeof line.unitPriceCents === "number" &&
    typeof line.quantity === "number" &&
    (line.type === "DIGITAL" || line.type === "PHYSICAL")
  );
}

function parseCart(raw: string | null): CartLine[] {
  if (!raw) return EMPTY_CART;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return EMPTY_CART;
    const lines = parsed.filter(isCartLine);
    return lines.length ? lines : EMPTY_CART;
  } catch {
    return EMPTY_CART;
  }
}

/** Stable snapshot — must not allocate a new array when data is unchanged. */
function getCartSnapshot(): CartLine[] {
  if (typeof window === "undefined") return EMPTY_CART;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedLines;
  cachedRaw = raw;
  cachedLines = parseCart(raw);
  return cachedLines;
}

function getServerCartSnapshot(): CartLine[] {
  return EMPTY_CART;
}

function writeCart(lines: CartLine[]) {
  const next = lines.length ? lines : EMPTY_CART;
  const raw = next === EMPTY_CART ? null : JSON.stringify(next);
  cachedRaw = raw;
  cachedLines = next;
  if (raw === null) {
    window.localStorage.removeItem(STORAGE_KEY);
  } else {
    window.localStorage.setItem(STORAGE_KEY, raw);
  }
  window.dispatchEvent(new Event("tmc-cart"));
}

function subscribeCart(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("tmc-cart", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("tmc-cart", onStoreChange);
  };
}

function subscribeReady() {
  return () => {};
}

function getClientReady() {
  return true;
}

function getServerReady() {
  return false;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(
    subscribeCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const ready = useSyncExternalStore(subscribeReady, getClientReady, getServerReady);
  const [isOpen, setIsOpen] = useState(false);

  const setLines = useCallback((updater: CartLine[] | ((current: CartLine[]) => CartLine[])) => {
    const current = getCartSnapshot();
    const next = typeof updater === "function" ? updater(current) : updater;
    writeCart(next);
  }, []);

  const addItem = useCallback(
    (item: Omit<CartLine, "quantity"> & { quantity?: number }) => {
      const quantity = item.quantity ?? 1;
      setLines((current) => {
        const key = lineKey(item.productId, item.licenceOptionId);
        const existing = current.find(
          (line) => lineKey(line.productId, line.licenceOptionId) === key,
        );
        if (existing) {
          return current.map((line) => {
            if (lineKey(line.productId, line.licenceOptionId) !== key) return line;
            const nextQty = Math.min(99, line.quantity + quantity);
            return {
              ...line,
              quantity: nextQty,
              unitPriceCents: line.licenceOptionId
                ? line.unitPriceCents
                : resolveVolumeUnitPrice(line.slug, nextQty, item.unitPriceCents),
            };
          });
        }
        const nextQty = Math.min(99, quantity);
        return [
          ...current,
          {
            ...item,
            quantity: nextQty,
            unitPriceCents: item.licenceOptionId
              ? item.unitPriceCents
              : resolveVolumeUnitPrice(item.slug, nextQty, item.unitPriceCents),
          },
        ];
      });
      setIsOpen(true);
    },
    [setLines],
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, licenceOptionId?: string) => {
      setLines((current) => {
        if (quantity <= 0) {
          return current.filter(
            (line) =>
              lineKey(line.productId, line.licenceOptionId) !==
              lineKey(productId, licenceOptionId),
          );
        }
        return current.map((line) => {
          if (
            lineKey(line.productId, line.licenceOptionId) !==
            lineKey(productId, licenceOptionId)
          ) {
            return line;
          }
          const nextQty = Math.min(99, quantity);
          return {
            ...line,
            quantity: nextQty,
            unitPriceCents: line.licenceOptionId
              ? line.unitPriceCents
              : resolveVolumeUnitPrice(line.slug, nextQty, line.unitPriceCents),
          };
        });
      });
    },
    [setLines],
  );

  const removeItem = useCallback(
    (productId: string, licenceOptionId?: string) => {
      setLines((current) =>
        current.filter(
          (line) =>
            lineKey(line.productId, line.licenceOptionId) !==
            lineKey(productId, licenceOptionId),
        ),
      );
    },
    [setLines],
  );

  const clearCart = useCallback(() => setLines(EMPTY_CART), [setLines]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((open) => !open), []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotalCents = lines.reduce(
      (sum, line) => sum + line.unitPriceCents * line.quantity,
      0,
    );
    return {
      lines,
      ready,
      itemCount,
      subtotalCents,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [
    addItem,
    clearCart,
    closeCart,
    isOpen,
    lines,
    openCart,
    ready,
    removeItem,
    toggleCart,
    updateQuantity,
  ]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
