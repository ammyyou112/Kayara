import type { Cart, Collection, Product, ShopAdapter } from "./types";

const missingShopify = (): never => {
  throw new Error(
    "Shopify adapter is configured, but the Storefront API implementation is not connected yet."
  );
};

export const shopifyAdapter: ShopAdapter = {
  async getCollection(): Promise<Collection | null> {
    return missingShopify();
  },
  async getCollections(): Promise<Collection[]> {
    return missingShopify();
  },
  async getProduct(): Promise<Product | null> {
    return missingShopify();
  },
  async getProducts(): Promise<Product[]> {
    return missingShopify();
  },
  async getProductsByCollection(): Promise<Product[]> {
    return missingShopify();
  },
  async searchProducts(): Promise<Product[]> {
    return missingShopify();
  },
  async createCart(): Promise<Cart> {
    return missingShopify();
  },
  async addToCart(): Promise<Cart> {
    return missingShopify();
  }
};
