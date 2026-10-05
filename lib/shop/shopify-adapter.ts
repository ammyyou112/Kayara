import { collectionHref, productHref } from "../format";
import {
  defaultFooterMenu,
  defaultHeroSlides,
  defaultMainMenu,
  defaultSiteSettings
} from "./defaults";
import { shopifyDomain, shopifyFetch } from "./shopify/client";
import * as Q from "./shopify/queries";
import type {
  Cart,
  Collection,
  HeroSlide,
  Image,
  MenuItem,
  Money,
  Page,
  Product,
  ProductSort,
  ShopAdapter,
  SiteSettings,
  World
} from "./types";

// ---------------------------------------------------------------------------
// Raw Storefront API shapes (only the fields we query)
// ---------------------------------------------------------------------------

type RawMoney = { amount: string; currencyCode: string };
type RawImage = { url: string; altText: string | null } | null;
type RawMetafield = { value: string } | null;
type Nodes<T> = { nodes: T[] };

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  options: { name: string; optionValues: { name: string }[] }[];
  priceRange: { minVariantPrice: RawMoney; maxVariantPrice: RawMoney };
  images: Nodes<NonNullable<RawImage>>;
  variants: Nodes<{
    id: string;
    title: string;
    availableForSale: boolean;
    price: RawMoney;
    compareAtPrice: RawMoney | null;
    selectedOptions: { name: string; value: string }[];
  }>;
  collections: Nodes<{ handle: string }>;
  seo: { title: string | null; description: string | null };
  world: RawMetafield;
};

type RawWorldSample = { productType: string; tags: string[]; world: RawMetafield };

type RawCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: RawImage;
  seo: { title: string | null; description: string | null };
  subtitle: RawMetafield;
  world: RawMetafield;
  sample: Nodes<RawWorldSample & { featuredImage: RawImage }>;
};

type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: RawMoney; totalAmount: RawMoney };
  lines: Nodes<{
    id: string;
    quantity: number;
    cost: { totalAmount: RawMoney };
    merchandise: RawProduct["variants"]["nodes"][number] & {
      image: RawImage;
      product: {
        id: string;
        handle: string;
        title: string;
        productType: string;
        tags: string[];
        featuredImage: RawImage;
        world: RawMetafield;
      };
    };
  }>;
};

type RawMenuItem = {
  title: string;
  url: string | null;
  type: string;
  resource:
    | { handle: string; world: RawMetafield; sample?: Nodes<RawWorldSample>; productType?: string; tags?: string[] }
    | null;
  items?: RawMenuItem[];
};

type RawMetaobject = {
  id: string;
  handle: string;
  fields: {
    key: string;
    value: string | null;
    reference: { image?: RawImage; handle?: string } | null;
    references: Nodes<{ image?: RawImage; handle?: string }> | null;
  }[];
};

// ---------------------------------------------------------------------------
// Mapping helpers
// ---------------------------------------------------------------------------

const IGNORED_COLLECTIONS = new Set(["frontpage", "all"]);

const toMoney = (money: RawMoney): Money => ({
  amount: Number.parseFloat(money.amount),
  currencyCode: money.currencyCode
});

const toImage = (image: RawImage, fallbackAlt: string): Image | null =>
  image?.url ? { url: image.url, altText: image.altText || fallbackAlt } : null;

/**
 * Which "world" a product belongs to. Priority: the custom.world metafield,
 * then the product type, then tags. Anything mentioning "jewel" is jewelry;
 * everything else is clothing.
 */
const worldOf = (sample: RawWorldSample): World => {
  const explicit = sample.world?.value?.toLowerCase();
  if (explicit) {
    return explicit.includes("jewel") ? "jewelry" : "clothing";
  }
  return [sample.productType, ...sample.tags].some((value) =>
    value?.toLowerCase().includes("jewel")
  )
    ? "jewelry"
    : "clothing";
};

/** A collection's world: its own metafield, else the majority of its products. */
const collectionWorld = (world: RawMetafield, sample: RawWorldSample[] = []): World => {
  const explicit = world?.value?.toLowerCase();
  if (explicit) {
    return explicit.includes("jewel") ? "jewelry" : "clothing";
  }
  const jewelry = sample.filter((product) => worldOf(product) === "jewelry").length;
  return jewelry > sample.length / 2 ? "jewelry" : "clothing";
};

const toProduct = (raw: RawProduct): Product => {
  const options = raw.options
    .filter(
      (option) =>
        !(option.optionValues.length === 1 && option.optionValues[0].name === "Default Title")
    )
    .map((option) => ({
      name: option.name,
      values: option.optionValues.map((value) => value.name)
    }));

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    world: worldOf(raw),
    collectionHandle:
      raw.collections.nodes.find((collection) => !IGNORED_COLLECTIONS.has(collection.handle))
        ?.handle ?? "",
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    tags: raw.tags,
    availableForSale: raw.availableForSale,
    priceRange: {
      minVariantPrice: toMoney(raw.priceRange.minVariantPrice),
      maxVariantPrice: toMoney(raw.priceRange.maxVariantPrice)
    },
    options,
    images: raw.images.nodes.map((image, index) => ({
      url: image.url,
      altText: image.altText || `${raw.title} — view ${index + 1}`
    })),
    variants: raw.variants.nodes.map((variant) => ({
      id: variant.id,
      title: variant.title === "Default Title" ? "" : variant.title,
      availableForSale: variant.availableForSale,
      price: toMoney(variant.price),
      compareAtPrice: variant.compareAtPrice ? toMoney(variant.compareAtPrice) : null,
      selectedOptions: Object.fromEntries(
        variant.selectedOptions.map((option) => [option.name, option.value])
      )
    })),
    seo: {
      title: raw.seo.title ?? undefined,
      description: raw.seo.description ?? undefined
    }
  };
};

const toCollection = (raw: RawCollection): Collection => ({
  id: raw.id,
  handle: raw.handle,
  title: raw.title,
  world: collectionWorld(raw.world, raw.sample.nodes),
  parenthetical: raw.subtitle?.value ?? "",
  description: raw.description,
  heroImage:
    toImage(raw.image, raw.title) ??
    toImage(raw.sample.nodes.find((product) => product.featuredImage)?.featuredImage ?? null, raw.title),
  seo: {
    title: raw.seo.title ?? undefined,
    description: raw.seo.description ?? undefined
  }
});

const toCart = (raw: RawCart): Cart => ({
  id: raw.id,
  checkoutUrl: raw.checkoutUrl,
  totalQuantity: raw.totalQuantity,
  cost: {
    subtotalAmount: toMoney(raw.cost.subtotalAmount),
    totalAmount: toMoney(raw.cost.totalAmount)
  },
  lines: raw.lines.nodes
    .filter((line) => line.merchandise?.product)
    .map((line) => {
      const variant = line.merchandise;
      return {
        id: line.id,
        quantity: line.quantity,
        cost: { totalAmount: toMoney(line.cost.totalAmount) },
        product: {
          id: variant.product.id,
          handle: variant.product.handle,
          title: variant.product.title,
          world: worldOf(variant.product),
          image:
            toImage(variant.image, variant.product.title) ??
            toImage(variant.product.featuredImage, variant.product.title)
        },
        variant: {
          id: variant.id,
          title: variant.title === "Default Title" ? "" : variant.title,
          availableForSale: variant.availableForSale,
          price: toMoney(variant.price),
          compareAtPrice: variant.compareAtPrice ? toMoney(variant.compareAtPrice) : null,
          selectedOptions: Object.fromEntries(
            variant.selectedOptions.map((option) => [option.name, option.value])
          )
        }
      };
    })
});

/**
 * Turns any Shopify URL (menu item, metaobject link field) into a storefront
 * path. Links to the store's own domains become relative; Shopify's
 * /collections/all becomes /shop; everything else keeps its path, and the
 * /collections/[handle] and /products/[handle] redirect routes resolve the rest.
 */
export const toStorefrontPath = (url: string | null | undefined): string => {
  if (!url) {
    return "/";
  }
  let parsed: URL;
  try {
    parsed = new URL(url, "https://storefront.local");
  } catch {
    return url;
  }
  const internal =
    parsed.hostname === "storefront.local" ||
    parsed.hostname === shopifyDomain ||
    parsed.hostname.endsWith(".myshopify.com") ||
    parsed.hostname === process.env.NEXT_PUBLIC_SITE_DOMAIN;

  if (!internal) {
    return parsed.toString();
  }

  const path = parsed.pathname.replace(/\/$/, "") || "/";
  if (path === "/collections" || path === "/collections/all" || path === "/products") {
    return `/shop${parsed.search}`;
  }
  return `${path}${parsed.search}${parsed.hash}`;
};

const toMenuItem = (raw: RawMenuItem): MenuItem => {
  let href = toStorefrontPath(raw.url);
  if (raw.type === "COLLECTION" && raw.resource?.handle) {
    href = collectionHref(
      collectionWorld(raw.resource.world, raw.resource.sample?.nodes),
      raw.resource.handle
    );
  } else if (raw.type === "PRODUCT" && raw.resource?.handle) {
    href = productHref(
      worldOf({
        productType: raw.resource.productType ?? "",
        tags: raw.resource.tags ?? [],
        world: raw.resource.world
      }),
      raw.resource.handle
    );
  } else if (raw.type === "CATALOG") {
    href = "/shop";
  } else if (raw.type === "FRONTPAGE") {
    href = "/";
  } else if (raw.type === "SEARCH") {
    href = "/search";
  }
  return { title: raw.title, href, items: (raw.items ?? []).map(toMenuItem) };
};

const fieldMap = (metaobject: RawMetaobject) =>
  new Map(metaobject.fields.map((field) => [field.key, field]));

const text = (fields: ReturnType<typeof fieldMap>, key: string): string =>
  fields.get(key)?.value?.trim() ?? "";

/** Content queries degrade to the defaults instead of breaking the page. */
async function withFallback<T>(label: string, run: () => Promise<T | null>, fallback: T): Promise<T> {
  try {
    return (await run()) ?? fallback;
  } catch (error) {
    console.error(`[shopify] ${label} failed, using fallback content:`, error);
    return fallback;
  }
}

async function allPages<T>(
  fetchPage: (after: string | null) => Promise<{ pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: T[] } | null>,
  limit = 1000
): Promise<T[]> {
  const items: T[] = [];
  let after: string | null = null;
  while (items.length < limit) {
    const page = await fetchPage(after);
    if (!page) {
      break;
    }
    items.push(...page.nodes);
    if (!page.pageInfo.hasNextPage) {
      break;
    }
    after = page.pageInfo.endCursor;
  }
  return items;
}

const sortKeys: Record<ProductSort, { sortKey: string; reverse: boolean }> = {
  featured: { sortKey: "BEST_SELLING", reverse: false },
  newest: { sortKey: "CREATED_AT", reverse: true },
  "price-asc": { sortKey: "PRICE", reverse: false },
  "price-desc": { sortKey: "PRICE", reverse: true }
};

const assertNoUserErrors = (payload: { userErrors: { message: string }[] }) => {
  if (payload.userErrors.length) {
    throw new Error(payload.userErrors.map((error) => error.message).join("; "));
  }
};

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

export const shopifyAdapter: ShopAdapter = {
  name: "shopify",

  async getProduct(handle) {
    const data = await shopifyFetch<{ product: RawProduct | null }>(Q.productQuery, { handle });
    return data.product ? toProduct(data.product) : null;
  },

  async getProducts({ world, sort = "featured" } = {}) {
    const raw = await allPages<RawProduct>(async (after) => {
      const data = await shopifyFetch<{
        products: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: RawProduct[] };
      }>(Q.productsQuery, { first: 100, after, ...sortKeys[sort] });
      return data.products;
    });
    const products = raw.map(toProduct);
    return world ? products.filter((product) => product.world === world) : products;
  },

  async getProductsByCollection(handle) {
    const raw = await allPages<RawProduct>(async (after) => {
      const data = await shopifyFetch<{
        collection: {
          products: { pageInfo: { hasNextPage: boolean; endCursor: string | null }; nodes: RawProduct[] };
        } | null;
      }>(Q.collectionProductsQuery, { handle, first: 100, after });
      return data.collection?.products ?? null;
    });
    return raw.map(toProduct);
  },

  async getRecommendations(product) {
    const data = await shopifyFetch<{ productRecommendations: RawProduct[] | null }>(
      Q.recommendationsQuery,
      { productId: product.id }
    ).catch(() => ({ productRecommendations: null }));
    const recommended = (data.productRecommendations ?? []).map(toProduct);
    if (recommended.length >= 4) {
      return recommended.slice(0, 8);
    }
    const siblings = product.collectionHandle
      ? await this.getProductsByCollection(product.collectionHandle)
      : [];
    const seen = new Set([product.id, ...recommended.map((entry) => entry.id)]);
    return [...recommended, ...siblings.filter((entry) => !seen.has(entry.id))].slice(0, 8);
  },

  async searchProducts(query) {
    const term = query.trim();
    if (!term) {
      return [];
    }
    const data = await shopifyFetch<{ search: { nodes: (RawProduct | Record<string, never>)[] } }>(
      Q.searchQuery,
      { query: term }
    );
    return data.search.nodes
      .filter((node): node is RawProduct => "handle" in node)
      .map(toProduct);
  },

  async getCollection(handle) {
    const data = await shopifyFetch<{ collection: RawCollection | null }>(Q.collectionQuery, {
      handle
    });
    return data.collection ? toCollection(data.collection) : null;
  },

  async getCollections(world) {
    const data = await shopifyFetch<{ collections: Nodes<RawCollection> }>(Q.collectionsQuery);
    const collections = data.collections.nodes
      .filter(
        (collection) =>
          !IGNORED_COLLECTIONS.has(collection.handle) && collection.sample.nodes.length > 0
      )
      .map(toCollection);
    return world ? collections.filter((collection) => collection.world === world) : collections;
  },

  // Cart operations always bypass the cache.
  async getCart(cartId) {
    const data = await shopifyFetch<{ cart: RawCart | null }>(
      Q.cartQuery,
      { cartId },
      { cache: "no-store" }
    );
    return data.cart ? toCart(data.cart) : null;
  },

  async createCart(lines = []) {
    const data = await shopifyFetch<{
      cartCreate: { cart: RawCart; userErrors: { message: string }[] };
    }>(
      Q.cartCreateMutation,
      { lines: lines.map((line) => ({ merchandiseId: line.variantId, quantity: line.quantity })) },
      { cache: "no-store" }
    );
    assertNoUserErrors(data.cartCreate);
    return toCart(data.cartCreate.cart);
  },

  async addToCart(cartId, variantId, quantity) {
    const data = await shopifyFetch<{
      cartLinesAdd: { cart: RawCart | null; userErrors: { message: string }[] };
    }>(
      Q.cartLinesAddMutation,
      { cartId, lines: [{ merchandiseId: variantId, quantity }] },
      { cache: "no-store" }
    );
    assertNoUserErrors(data.cartLinesAdd);
    if (!data.cartLinesAdd.cart) {
      return this.createCart([{ variantId, quantity }]);
    }
    return toCart(data.cartLinesAdd.cart);
  },

  async updateCartLine(cartId, lineId, quantity) {
    if (quantity <= 0) {
      return this.removeCartLine(cartId, lineId);
    }
    const data = await shopifyFetch<{
      cartLinesUpdate: { cart: RawCart; userErrors: { message: string }[] };
    }>(
      Q.cartLinesUpdateMutation,
      { cartId, lines: [{ id: lineId, quantity }] },
      { cache: "no-store" }
    );
    assertNoUserErrors(data.cartLinesUpdate);
    return toCart(data.cartLinesUpdate.cart);
  },

  async removeCartLine(cartId, lineId) {
    const data = await shopifyFetch<{
      cartLinesRemove: { cart: RawCart; userErrors: { message: string }[] };
    }>(Q.cartLinesRemoveMutation, { cartId, lineIds: [lineId] }, { cache: "no-store" });
    assertNoUserErrors(data.cartLinesRemove);
    return toCart(data.cartLinesRemove.cart);
  },

  async getMenu(handle) {
    const fallback =
      handle === "main-menu" ? defaultMainMenu : handle === "footer" ? defaultFooterMenu : null;
    return withFallback(
      `menu "${handle}"`,
      async () => {
        const data = await shopifyFetch<{ menu: { items: RawMenuItem[] } | null }>(Q.menuQuery, {
          handle
        });
        return data.menu?.items.length ? data.menu.items.map(toMenuItem) : null;
      },
      fallback
    );
  },

  async getSiteSettings() {
    return withFallback<SiteSettings>(
      "site_settings metaobject",
      async () => {
        const data = await shopifyFetch<{ metaobjects: Nodes<RawMetaobject> }>(
          Q.metaobjectsQuery,
          { type: "site_settings", first: 1 }
        );
        const entry = data.metaobjects.nodes[0];
        if (!entry) {
          return null;
        }
        const fields = fieldMap(entry);
        const or = (key: string, fallback: string) => text(fields, key) || fallback;

        const socials = (
          [
            ["Instagram", "instagram_url"],
            ["Facebook", "facebook_url"],
            ["TikTok", "tiktok_url"],
            ["YouTube", "youtube_url"],
            ["Pinterest", "pinterest_url"],
            ["WhatsApp", "whatsapp_url"]
          ] as const
        )
          .map(([label, key]) => ({ label, href: text(fields, key) }))
          .filter((social) => social.href);

        const instagramImages = (fields.get("instagram_images")?.references?.nodes ?? [])
          .map((node, i) => toImage(node.image ?? null, `KAYRA on Instagram ${i + 1}`))
          .filter((image): image is Image => image !== null);

        const featuredCollections = (fields.get("featured_collections")?.references?.nodes ?? [])
          .map((node) => node.handle)
          .filter((handle): handle is string => Boolean(handle));

        return {
          announcement: or("announcement", defaultSiteSettings.announcement),
          announcementSecondary: text(fields, "announcement_secondary"),
          tagline: or("tagline", defaultSiteSettings.tagline),
          footerNote: or("footer_note", defaultSiteSettings.footerNote),
          socials,
          instagramHandle: or("instagram_handle", defaultSiteSettings.instagramHandle),
          instagramUrl: text(fields, "instagram_url"),
          instagramImages: instagramImages.length
            ? instagramImages
            : defaultSiteSettings.instagramImages,
          featuredCollections,
          trendingCollection: fields.get("trending_collection")?.reference?.handle ?? ""
        };
      },
      defaultSiteSettings
    );
  },

  async getHeroSlides() {
    return withFallback<HeroSlide[]>(
      "hero_slide metaobjects",
      async () => {
        const data = await shopifyFetch<{ metaobjects: Nodes<RawMetaobject> }>(
          Q.metaobjectsQuery,
          { type: "hero_slide", first: 12 }
        );
        const slides = data.metaobjects.nodes
          .map((entry) => {
            const fields = fieldMap(entry);
            const image = toImage(fields.get("image")?.reference?.image ?? null, text(fields, "title"));
            if (!image) {
              return null;
            }
            return {
              position: Number(text(fields, "position") || 999),
              slide: {
                id: entry.handle,
                image,
                href: toStorefrontPath(text(fields, "link") || "/shop"),
                eyebrow: text(fields, "eyebrow"),
                title: text(fields, "title"),
                cta: text(fields, "cta_label") || "Shop now"
              }
            };
          })
          .filter((entry) => entry !== null)
          .sort((a, b) => a.position - b.position)
          .map((entry) => entry.slide);
        return slides.length ? slides : null;
      },
      defaultHeroSlides
    );
  },

  async getPage(handle) {
    return withFallback<Page | null>(
      `page "${handle}"`,
      async () => {
        const data = await shopifyFetch<{
          page: { handle: string; title: string; body: string; seo: { title: string | null; description: string | null } } | null;
        }>(Q.pageQuery, { handle });
        return data.page
          ? {
              handle: data.page.handle,
              title: data.page.title,
              body: data.page.body,
              seo: {
                title: data.page.seo.title ?? undefined,
                description: data.page.seo.description ?? undefined
              }
            }
          : null;
      },
      null
    );
  },

  async getPolicy(handle) {
    return withFallback<Page | null>(
      `policy "${handle}"`,
      async () => {
        type RawPolicy = { handle: string; title: string; body: string } | null;
        const data = await shopifyFetch<{ shop: Record<string, RawPolicy> }>(Q.policiesQuery);
        const policy = Object.values(data.shop).find((entry) => entry?.handle === handle);
        return policy ? { handle: policy.handle, title: policy.title, body: policy.body } : null;
      },
      null
    );
  }
};
