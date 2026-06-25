export type World = "clothing" | "jewelry";

export type Money = {
  amount: number;
  currencyCode: "PKR";
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  selectedOptions: Record<string, string>;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  world: World;
  collectionHandle: string;
  description: string;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  images: Array<{
    url: string;
    altText: string;
  }>;
  variants: ProductVariant[];
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  world: World;
  parenthetical: string;
  description: string;
  heroImage: {
    url: string;
    altText: string;
  };
};

export type CartLine = {
  id: string;
  product: Product;
  variant: ProductVariant;
  quantity: number;
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
};

export type ShopAdapter = {
  getCollection(handle: string): Promise<Collection | null>;
  getCollections(world?: World): Promise<Collection[]>;
  getProduct(handle: string): Promise<Product | null>;
  getProducts(world?: World): Promise<Product[]>;
  getProductsByCollection(handle: string): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createCart(): Promise<Cart>;
  addToCart(cartId: string, variantId: string, quantity: number): Promise<Cart>;
};
