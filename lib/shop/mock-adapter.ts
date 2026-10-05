import { collections, products } from "./mock-data";
import {
  defaultFooterMenu,
  defaultHeroSlides,
  defaultMainMenu,
  defaultPages,
  defaultPolicies,
  defaultSiteSettings
} from "./defaults";
import type { Cart, CartLine, Product, ProductSort, ShopAdapter } from "./types";

// The mock cart is stateless: the cart id *is* the encoded list of lines, so
// it survives serverless cold starts (Vercel) without any storage. The server
// action that calls these methods persists whichever id comes back in a cookie.
type MockLine = [variantId: string, quantity: number];

const encodeCart = (lines: MockLine[]): string =>
  `mock:${Buffer.from(JSON.stringify(lines)).toString("base64url")}`;

const decodeCart = (cartId: string): MockLine[] => {
  if (!cartId.startsWith("mock:")) {
    return [];
  }
  try {
    const parsed: unknown = JSON.parse(
      Buffer.from(cartId.slice(5), "base64url").toString("utf8")
    );
    return Array.isArray(parsed)
      ? parsed.filter(
          (entry): entry is MockLine =>
            Array.isArray(entry) &&
            typeof entry[0] === "string" &&
            typeof entry[1] === "number" &&
            entry[1] > 0
        )
      : [];
  } catch {
    return [];
  }
};

const findVariant = (variantId: string) => {
  for (const product of products) {
    const variant = product.variants.find((entry) => entry.id === variantId);
    if (variant) {
      return { product, variant };
    }
  }
  return null;
};

const buildCart = (lines: MockLine[]): Cart => {
  const cartLines: CartLine[] = lines.flatMap(([variantId, quantity]) => {
    const match = findVariant(variantId);
    if (!match) {
      return [];
    }
    const { product, variant } = match;
    return [
      {
        id: variantId,
        quantity,
        variant,
        product: {
          id: product.id,
          handle: product.handle,
          title: product.title,
          world: product.world,
          image: product.images[0] ?? null
        },
        cost: {
          totalAmount: {
            amount: variant.price.amount * quantity,
            currencyCode: variant.price.currencyCode
          }
        }
      }
    ];
  });
  const subtotal = cartLines.reduce((sum, line) => sum + line.cost.totalAmount.amount, 0);
  const id = encodeCart(cartLines.map((line) => [line.id, line.quantity]));

  return {
    id,
    checkoutUrl: "/checkout",
    totalQuantity: cartLines.reduce((sum, line) => sum + line.quantity, 0),
    lines: cartLines,
    cost: {
      subtotalAmount: { amount: subtotal, currencyCode: "PKR" },
      totalAmount: { amount: subtotal, currencyCode: "PKR" }
    }
  };
};

const sortProducts = (items: Product[], sort: ProductSort = "featured"): Product[] => {
  const price = (product: Product) => product.priceRange.minVariantPrice.amount;
  if (sort === "price-asc") {
    return [...items].sort((a, b) => price(a) - price(b));
  }
  if (sort === "price-desc") {
    return [...items].sort((a, b) => price(b) - price(a));
  }
  if (sort === "newest") {
    return [...items].reverse();
  }
  return items;
};

export const mockShopAdapter: ShopAdapter = {
  name: "mock",
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
  async getProducts(options = {}) {
    const items = options.world
      ? products.filter((product) => product.world === options.world)
      : products;
    return sortProducts(items, options.sort);
  },
  async getProductsByCollection(handle) {
    return products.filter((product) => product.collectionHandle === handle);
  },
  async getRecommendations(product) {
    return [
      ...products.filter(
        (entry) =>
          entry.id !== product.id && entry.collectionHandle === product.collectionHandle
      ),
      ...products.filter(
        (entry) =>
          entry.id !== product.id && entry.collectionHandle !== product.collectionHandle
      )
    ].slice(0, 8);
  },
  async searchProducts(query) {
    const needle = query.trim().toLowerCase();
    if (!needle) {
      return [];
    }
    return products.filter((product) =>
      [product.title, product.description, product.collectionHandle, product.world, ...product.tags]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    );
  },

  async getCart(cartId) {
    return cartId.startsWith("mock:") ? buildCart(decodeCart(cartId)) : null;
  },
  async createCart(lines = []) {
    return buildCart(lines.map((line) => [line.variantId, line.quantity]));
  },
  async addToCart(cartId, variantId, quantity) {
    const lines = decodeCart(cartId);
    const existing = lines.find(([id]) => id === variantId);
    return buildCart(
      existing
        ? lines.map(([id, qty]) => [id, id === variantId ? qty + quantity : qty])
        : [...lines, [variantId, quantity]]
    );
  },
  async updateCartLine(cartId, lineId, quantity) {
    return buildCart(
      decodeCart(cartId)
        .map(([id, qty]): MockLine => [id, id === lineId ? quantity : qty])
        .filter(([, qty]) => qty > 0)
    );
  },
  async removeCartLine(cartId, lineId) {
    return buildCart(decodeCart(cartId).filter(([id]) => id !== lineId));
  },

  async getMenu(handle) {
    if (handle === "main-menu") {
      return defaultMainMenu;
    }
    if (handle === "footer") {
      return defaultFooterMenu;
    }
    return null;
  },
  async getSiteSettings() {
    return defaultSiteSettings;
  },
  async getHeroSlides() {
    return defaultHeroSlides;
  },
  async getPage(handle) {
    return defaultPages[handle] ?? null;
  },
  async getPolicy(handle) {
    return defaultPolicies[handle] ?? null;
  }
};
