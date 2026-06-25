import { mockShopAdapter } from "./mock-adapter";
import { shopifyAdapter } from "./shopify-adapter";
import type { ShopAdapter } from "./types";

const adapterName = process.env.NEXT_PUBLIC_SHOP_ADAPTER ?? "mock";

export const shop: ShopAdapter =
  adapterName === "shopify" ? shopifyAdapter : mockShopAdapter;

export type {
  Cart,
  CartLine,
  Collection,
  Money,
  Product,
  ProductVariant,
  ShopAdapter,
  World
} from "./types";
