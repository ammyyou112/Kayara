"use server";

import { shop } from "@/lib/shop";
import type { Product } from "@/lib/shop/types";

/** Fresh product data for saved handles (wishlist). Missing products are dropped. */
export async function getProductsByHandlesAction(handles: string[]): Promise<Product[]> {
  const unique = [...new Set(handles)].slice(0, 60);
  const products = await Promise.all(
    unique.map((handle) => shop.getProduct(handle).catch(() => null))
  );
  return products.filter((product): product is Product => product !== null);
}
