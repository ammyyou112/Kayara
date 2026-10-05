"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { getProductsByHandlesAction } from "@/app/actions/products";
import type { Product } from "@/lib/shop/types";

const STORAGE_KEY = "kayra-wishlist-v1";

type WishlistContextValue = {
  items: Product[];
  count: number;
  ready: boolean;
  has: (id: string) => boolean;
  toggle: (product: Product) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const isProductArray = (value: unknown): value is Product[] =>
  Array.isArray(value) &&
  value.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      "id" in entry &&
      "handle" in entry
  );

// Snapshots saved by older versions of the site lack newer fields.
const normalize = (product: Product): Product => ({
  ...product,
  tags: product.tags ?? [],
  options: product.options ?? [],
  availableForSale: product.availableForSale ?? true
});

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isProductArray(parsed)) {
          setItems(parsed.map(normalize));
          // Saved snapshots can go stale (price changes, deleted products):
          // refresh them from the store, keeping the saved order.
          const handles = parsed.map((item) => item.handle);
          getProductsByHandlesAction(handles)
            .then((fresh) => {
              const byHandle = new Map(fresh.map((product) => [product.handle, product]));
              setItems((current) =>
                current
                  .map((item) => byHandle.get(item.handle))
                  .filter((item): item is Product => Boolean(item))
              );
            })
            .catch(() => undefined);
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // storage may be unavailable
    }
  }, [items, ready]);

  const has = useCallback(
    (id: string) => items.some((item) => item.id === id),
    [items]
  );

  const toggle = useCallback((product: Product) => {
    setItems((current) =>
      current.some((item) => item.id === product.id)
        ? current.filter((item) => item.id !== product.id)
        : [...current, product]
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<WishlistContextValue>(
    () => ({ items, count: items.length, ready, has, toggle, remove, clear }),
    [items, ready, has, toggle, remove, clear]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
