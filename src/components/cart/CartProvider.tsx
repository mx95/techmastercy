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

const CartContext = createContext<CartContextValue | null>(null);

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

function readCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter(isCartLine) : [];
  } catch {
    return [];
  }
}

function writeCart(lines: CartLine[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  window.dispatchEvent(new Event("tmc-cart"));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("tmc-cart", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("tmc-cart", onStoreChange);
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(subscribe, readCart, () => []);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [isOpen, setIsOpen] = useState(false);

  const setLines = useCallback((updater: CartLine[] | ((current: CartLine[]) => CartLine[])) => {
    const current = readCart();
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
          return current.map((line) =>
            lineKey(line.productId, line.licenceOptionId) === key
              ? { ...line, quantity: Math.min(99, line.quantity + quantity) }
              : line,
          );
        }
        return [...current, { ...item, quantity: Math.min(99, quantity) }];
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
        return current.map((line) =>
          lineKey(line.productId, line.licenceOptionId) ===
          lineKey(productId, licenceOptionId)
            ? { ...line, quantity: Math.min(99, quantity) }
            : line,
        );
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

  const clearCart = useCallback(() => setLines([]), [setLines]);

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
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      toggleCart: () => setIsOpen((open) => !open),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    };
  }, [addItem, clearCart, isOpen, lines, ready, removeItem, updateQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
