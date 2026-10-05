import { mockShopAdapter } from "./mock-adapter";
import { shopifyAdapter } from "./shopify-adapter";
import { isShopifyConfigured } from "./shopify/client";
import type { ShopAdapter } from "./types";

// Shopify is used automatically once its credentials are present. SHOP_ADAPTER
// can force either adapter (e.g. SHOP_ADAPTER=mock for design work).
const forced = process.env.SHOP_ADAPTER ?? process.env.NEXT_PUBLIC_SHOP_ADAPTER;

export const shop: ShopAdapter =
  forced === "mock"
    ? mockShopAdapter
    : forced === "shopify" || isShopifyConfigured
      ? shopifyAdapter
      : mockShopAdapter;

export type {
  Cart,
  CartLine,
  CartProduct,
  Collection,
  HeroSlide,
  Image,
  MenuItem,
  Money,
  Page,
  Product,
  ProductOption,
  ProductSort,
  ProductVariant,
  ShopAdapter,
  SiteSettings,
  SocialLink,
  World
} from "./types";
