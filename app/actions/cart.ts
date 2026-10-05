"use server";

import { cookies } from "next/headers";
import { shop } from "@/lib/shop";
import type { Cart } from "@/lib/shop/types";

const CART_COOKIE = "kayra_cart";

async function saveCartId(cart: Cart) {
  const store = await cookies();
  store.set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
}

async function readCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_COOKIE)?.value ?? null;
}

export async function getCartAction(): Promise<Cart | null> {
  const cartId = await readCartId();
  if (!cartId) {
    return null;
  }
  try {
    return await shop.getCart(cartId);
  } catch (error) {
    console.error("[cart] could not load cart", error);
    return null;
  }
}

export async function addToCartAction(variantId: string, quantity = 1): Promise<Cart> {
  const cartId = await readCartId();
  const existing = cartId ? await shop.getCart(cartId).catch(() => null) : null;
  const cart = existing
    ? await shop.addToCart(existing.id, variantId, quantity)
    : await shop.createCart([{ variantId, quantity }]);
  await saveCartId(cart);
  return cart;
}

export async function updateCartLineAction(lineId: string, quantity: number): Promise<Cart | null> {
  const cartId = await readCartId();
  if (!cartId) {
    return null;
  }
  const cart =
    quantity > 0
      ? await shop.updateCartLine(cartId, lineId, quantity)
      : await shop.removeCartLine(cartId, lineId);
  await saveCartId(cart);
  return cart;
}

export async function removeCartLineAction(lineId: string): Promise<Cart | null> {
  return updateCartLineAction(lineId, 0);
}

export async function clearCartAction(): Promise<void> {
  const store = await cookies();
  store.delete(CART_COOKIE);
}
