export type World = "clothing" | "jewelry";

export type Money = {
  amount: number;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
};

export type ProductOption = {
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money | null;
  selectedOptions: Record<string, string>;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  world: World;
  /** Primary collection, used for breadcrumbs and "more from" rails. */
  collectionHandle: string;
  description: string;
  descriptionHtml?: string;
  tags: string[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  /** Options that actually vary (Shopify's implicit "Title" option is dropped). */
  options: ProductOption[];
  images: Image[];
  variants: ProductVariant[];
  seo?: { title?: string; description?: string };
};

export type Collection = {
  id: string;
  handle: string;
  title: string;
  world: World;
  /** Small eyebrow line above the title (Shopify metafield custom.subtitle). */
  parenthetical: string;
  description: string;
  heroImage: Image | null;
  seo?: { title?: string; description?: string };
};

/** The slice of a product a cart line needs to render itself. */
export type CartProduct = Pick<Product, "id" | "handle" | "title" | "world"> & {
  image: Image | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  product: CartProduct;
  variant: ProductVariant;
  cost: { totalAmount: Money };
};

export type Cart = {
  id: string;
  /** Shopify's hosted checkout URL (or the local demo checkout in mock mode). */
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
};

export type MenuItem = {
  title: string;
  href: string;
  items: MenuItem[];
};

export type SocialLink = {
  label: string;
  href: string;
};

export type HeroSlide = {
  id: string;
  image: Image;
  href: string;
  eyebrow: string;
  title: string;
  cta: string;
};

export type SiteSettings = {
  /** Announcement bar messages; empty hides the bar. */
  announcements: string[];
  /** Run the messages across the bar (marquee) instead of standing still. */
  announcementScroll: boolean;
  tagline: string;
  newsletterTitle: string;
  footerNote: string;
  socials: SocialLink[];
  instagramHandle: string;
  instagramUrl: string;
  instagramImages: Image[];
  /** Handles of the collections shown on the homepage, in order. Empty = all. */
  featuredCollections: string[];
  /** Handle of the collection that powers "Trending Now". Empty = most expensive first. */
  trendingCollection: string;
  contactEmail: string;
  contactPhone: string;
  /** wa.me link built from the WhatsApp number. Empty = no WhatsApp button. */
  whatsappUrl: string;
  whatsappNumber: string;
  /** Optional message pre-typed in WhatsApp. */
  whatsappMessage: string;
  address: string;
  businessHours: string;
  seoTitle: string;
  seoDescription: string;
};

/**
 * An editable section of the storefront, filled from the Shopify metaobjects
 * described in lib/shop/cms.ts. `key` is the section (e.g. "home-statement");
 * for list entries (slides, chapters…) it is the entry handle and `list` names
 * the list (e.g. "lookbook-chapter").
 */
export type ContentBlock = {
  key: string;
  list?: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Plain text; blank lines separate paragraphs. */
  body: string;
  images: Image[];
  ctaLabel: string;
  ctaLink: string;
  /** Handle of a referenced collection. */
  collection: string;
  position: number;
  /** Extra named values, e.g. size table measurements. */
  cells?: Record<string, string>;
};

export type ContentBlockDefaults = Partial<Omit<ContentBlock, "key" | "list">>;

export type Page = {
  handle: string;
  title: string;
  body: string;
  seo?: { title?: string; description?: string };
};

export type ProductSort = "featured" | "newest" | "price-asc" | "price-desc";

export type ShopAdapter = {
  name: "mock" | "shopify";
  getCollection(handle: string): Promise<Collection | null>;
  getCollections(world?: World): Promise<Collection[]>;
  getProduct(handle: string): Promise<Product | null>;
  getProducts(options?: { world?: World; sort?: ProductSort }): Promise<Product[]>;
  getProductsByCollection(handle: string): Promise<Product[]>;
  getRecommendations(product: Product): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;

  getCart(cartId: string): Promise<Cart | null>;
  createCart(lines?: { variantId: string; quantity: number }[]): Promise<Cart>;
  addToCart(cartId: string, variantId: string, quantity: number): Promise<Cart>;
  updateCartLine(cartId: string, lineId: string, quantity: number): Promise<Cart>;
  removeCartLine(cartId: string, lineId: string): Promise<Cart>;

  getMenu(handle: string): Promise<MenuItem[] | null>;
  getSiteSettings(): Promise<SiteSettings>;
  getHeroSlides(): Promise<HeroSlide[]>;
  /** Page sections and list entries from Shopify (empty in mock mode). */
  getContentBlocks(): Promise<ContentBlock[]>;
  getPage(handle: string): Promise<Page | null>;
  getPolicy(handle: string): Promise<Page | null>;
};
