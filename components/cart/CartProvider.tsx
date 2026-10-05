"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition
} from "react";
import {
  addToCartAction,
  clearCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction
} from "@/app/actions/cart";
import type { Cart, CartLine } from "@/lib/shop/types";

type CartContextValue = {
  cart: Cart | null;
  lines: CartLine[];
  count: number;
  ready: boolean;
  pending: boolean;
  error: string | null;
  /** The line most recently added, for the "added to bag" toast. */
  lastAdded: { line: CartLine; key: number } | null;
  dismissLastAdded: () => void;
  addLine: (variantId: string, quantity?: number) => Promise<boolean>;
  setQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clear: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

// The cart lives on the server (a Shopify cart, or the stateless mock cart);
// the browser only holds the id in an httpOnly cookie. Prices and totals always
// come back from the server, so they can never drift from what checkout charges.
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAdded, setLastAdded] = useState<CartContextValue["lastAdded"]>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    let active = true;
    getCartAction()
      .then((next) => active && setCart(next))
      .catch(() => undefined)
      .finally(() => active && setReady(true));
    return () => {
      active = false;
    };
  }, []);

  const addLine = useCallback(async (variantId: string, quantity = 1) => {
    setError(null);
    try {
      const next = await addToCartAction(variantId, quantity);
      setCart(next);
      const line = next.lines.find((entry) => entry.variant.id === variantId);
      if (line) {
        setLastAdded({ line, key: Date.now() });
      }
      return true;
    } catch {
      setError("We couldn't add that piece. Please try again.");
      return false;
    }
  }, []);

  const mutateLine = useCallback((lineId: string, quantity: number) => {
    setError(null);
    // Optimistic: reflect the change immediately, then settle on the server cart.
    setCart((current) =>
      current
        ? {
            ...current,
            lines: current.lines
              .map((line) => (line.id === lineId ? { ...line, quantity } : line))
              .filter((line) => line.quantity > 0)
          }
        : current
    );
    startTransition(async () => {
      try {
        const next =
          quantity > 0
            ? await updateCartLineAction(lineId, quantity)
            : await removeCartLineAction(lineId);
        setCart(next);
      } catch {
        setError("We couldn't update your bag. Please try again.");
        setCart(await getCartAction());
      }
    });
  }, []);

  const setQuantity = useCallback(
    (lineId: string, quantity: number) => mutateLine(lineId, Math.max(0, quantity)),
    [mutateLine]
  );
  const removeLine = useCallback((lineId: string) => mutateLine(lineId, 0), [mutateLine]);

  const dismissLastAdded = useCallback(() => setLastAdded(null), []);

  const clear = useCallback(async () => {
    await clearCartAction();
    setCart(null);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const lines = cart?.lines ?? [];
    return {
      cart,
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      ready,
      pending,
      error,
      lastAdded,
      dismissLastAdded,
      addLine,
      setQuantity,
      removeLine,
      clear
    };
  }, [cart, ready, pending, error, lastAdded, dismissLastAdded, addLine, setQuantity, removeLine, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
