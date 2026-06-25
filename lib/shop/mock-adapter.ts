import { collections, products } from "./mock-data";
import type { Cart, ShopAdapter } from "./types";

const carts = new Map<string, Cart>();

const emptyCart = (id: string): Cart => ({
  id,
  checkoutUrl: `/cart?mock=${id}`,
  lines: [],
  cost: {
    subtotalAmount: { amount: 0, currencyCode: "PKR" },
    totalAmount: { amount: 0, currencyCode: "PKR" }
  }
});

const priceCart = (cart: Cart): Cart => {
  const subtotal = cart.lines.reduce(
    (sum, line) => sum + line.variant.price.amount * line.quantity,
    0
  );

  return {
    ...cart,
    cost: {
      subtotalAmount: { amount: subtotal, currencyCode: "PKR" },
      totalAmount: { amount: subtotal, currencyCode: "PKR" }
    }
  };
};

export const mockShopAdapter: ShopAdapter = {
  async getCollection(handle) {
    return collections.find((collection) => collection.handle === handle) ?? null;
  },
  async getCollections(world) {
    return world
      ? collections.filter((collection) => collection.world === world)
      : collections;
  },
  async getProduct(handle) {
    return products.find((product) => product.handle === handle) ?? null;
  },
  async getProducts(world) {
    return world ? products.filter((product) => product.world === world) : products;
  },
  async getProductsByCollection(handle) {
    return products.filter((product) => product.collectionHandle === handle);
  },
  async searchProducts(query) {
    const needle = query.trim().toLowerCase();

    if (!needle) {
      return [];
    }

    return products.filter((product) =>
      [
        product.title,
        product.description,
        product.collectionHandle,
        product.world
      ]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  },
  async createCart() {
    const cart = emptyCart(`mock-cart-${crypto.randomUUID()}`);
    carts.set(cart.id, cart);
    return cart;
  },
  async addToCart(cartId, variantId, quantity) {
    const cart = carts.get(cartId) ?? emptyCart(cartId);
    const product = products.find((entry) =>
      entry.variants.some((variant) => variant.id === variantId)
    );
    const variant = product?.variants.find((entry) => entry.id === variantId);

    if (!product || !variant) {
      return priceCart(cart);
    }

    const existing = cart.lines.find((line) => line.variant.id === variantId);
    const nextLines = existing
      ? cart.lines.map((line) =>
          line.variant.id === variantId
            ? { ...line, quantity: line.quantity + quantity }
            : line
        )
      : [
          ...cart.lines,
          {
            id: `line-${variantId}`,
            product,
            variant,
            quantity
          }
        ];

    const nextCart = priceCart({ ...cart, lines: nextLines });
    carts.set(cartId, nextCart);
    return nextCart;
  }
};
