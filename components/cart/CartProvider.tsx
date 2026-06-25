"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import type { CartLine, Product, ProductVariant } from "@/lib/shop/types";

const STORAGE_KEY = "kayra-cart-v1";

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  ready: boolean;
  addLine: (
    product: Product,
    variant: ProductVariant,
    quantity?: number
  ) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const isCartLineArray = (value: unknown): value is CartLine[] =>
  Array.isArray(value) &&
  value.every(
    (entry) =>
      typeof entry === "object" &&
      entry !== null &&
      "variant" in entry &&
      "product" in entry &&
      "quantity" in entry
  );

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (isCartLineArray(parsed)) {
          setLines(parsed);
        }
      }
    } catch {
      // Ignore corrupt storage and start with an empty bag.
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Storage may be unavailable (private mode); cart stays in memory.
    }
  }, [lines, ready]);

  const addLine = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      setLines((current) => {
        const existing = current.find((line) => line.id === variant.id);
        if (existing) {
          return current.map((line) =>
            line.id === variant.id
              ? { ...line, quantity: line.quantity + quantity }
              : line
          );
        }
        return [...current, { id: variant.id, product, variant, quantity }];
      });
    },
    []
  );

  const setQuantity = useCallback((lineId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.id !== lineId)
        : current.map((line) =>
            line.id === lineId ? { ...line, quantity } : line
          )
    );
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setLines((current) => current.filter((line) => line.id !== lineId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((sum, line) => sum + line.quantity, 0);
    const subtotal = lines.reduce(
      (sum, line) => sum + line.variant.price.amount * line.quantity,
      0
    );
    return {
      lines,
      count,
      subtotal,
      ready,
      addLine,
      setQuantity,
      removeLine,
      clear
    };
  }, [lines, ready, addLine, setQuantity, removeLine, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
