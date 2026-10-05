# KAYRA

Headless luxury fashion and jewelry storefront: Next.js 15, React 19, TypeScript, Tailwind CSS 4, Motion, GSAP and Lenis, with Shopify as the backend for everything (catalog, cart, checkout, menus, and site content).

## How it works

- All data goes through `lib/shop` (`shop.getProducts()`, `shop.getMenu()` …).
- With Shopify credentials set, `lib/shop/shopify-adapter.ts` uses the **Storefront API**. Without them, `mock-adapter.ts` serves demo data, so the site always renders.
- The cart is a real Shopify cart. Its id lives in an httpOnly cookie, and **checkout is Shopify's hosted checkout** (`cart.checkoutUrl`), so payments, taxes, shipping and discount codes are all handled by Shopify.
- Responses are cached for `SHOPIFY_REVALIDATE_SECONDS` (default 5 minutes). Webhooks to `/api/revalidate` refresh the site immediately after an edit.

## Connecting Shopify

### 1. Create the API access

1. In Shopify admin, install the **Headless** sales channel (Shopify App Store → "Headless", by Shopify) and create a storefront.
2. Under **Storefront API → Manage permissions**, enable read access for products, collections, product listings, product tags, inventory, metaobjects, online store pages and navigation, plus cart read/write.
3. Copy the **public** (or **private**) access token.
4. Make products available to the Headless sales channel: Products → select all → *Include in sales channels* → Headless.

### 2. Add environment variables on Vercel

Project → Settings → Environment Variables (see `.env.example`):

| Variable | Value |
|---|---|
| `SHOPIFY_STORE_DOMAIN` | `your-store.myshopify.com` |
| `SHOPIFY_STOREFRONT_ACCESS_TOKEN` (or `SHOPIFY_STOREFRONT_PRIVATE_TOKEN`) | token from step 1 |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` |
| `SHOPIFY_WEBHOOK_SECRET` | see step 4 |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | optional, for newsletter signups |

Then redeploy. Remove any old `NEXT_PUBLIC_SHOP_ADAPTER=mock` variable.

### 3. Set up content in Shopify admin

| What on the site | Where in Shopify |
|---|---|
| Products, prices, variants, stock, images | Products |
| Clothing vs Jewelry | Product **type** or a **tag** containing "jewelry" (anything else is clothing). Optional metafield `custom.world` |
| Collections | Collections. Optional metafields: `custom.subtitle` (small line above the title) and `custom.world` |
| Header menu | Online Store → Navigation → **Main menu** (`main-menu`). Nested items become dropdowns |
| Footer columns | Navigation → **Footer menu** (`footer`). Each top-level item is a column heading, its children are the links |
| Announcement bar, socials, tagline, Instagram, homepage picks | Metaobject **`site_settings`** (one entry, see below) |
| Homepage hero slider | Metaobject entries of type **`hero_slide`** |
| About story / Contact / any page | Online Store → Pages (`/pages/<handle>`; the "about" page fills the About story) |
| Shipping / Returns / Privacy / Terms | Settings → Policies (`/policies/shipping-policy` etc.) |
| Newsletter subscribers | Customers (email marketing: Subscribed), when `SHOPIFY_ADMIN_ACCESS_TOKEN` is set |

**Metaobject `site_settings`** (Content → Metaobjects → Add definition, enable *Storefronts* access). All fields are optional:

| Key | Type |
|---|---|
| `announcement` | Single line text |
| `announcement_secondary` | Single line text (e.g. WhatsApp number) |
| `tagline` | Multi-line text |
| `footer_note` | Single line text |
| `instagram_handle` | Single line text |
| `instagram_url`, `facebook_url`, `tiktok_url`, `youtube_url`, `pinterest_url`, `whatsapp_url` | URL |
| `instagram_images` | File (list of images) |
| `featured_collections` | Collection (list) |
| `trending_collection` | Collection |

**Metaobject `hero_slide`** (enable *Storefronts* access): `image` (File), `eyebrow`, `title`, `cta_label` (Single line text), `link` (URL or path such as `/collections/bridal`), `position` (Integer).

Any of these that are missing fall back to the built-in defaults in `lib/shop/defaults.ts`.

### 4. Instant updates (webhooks)

Settings → Notifications → Webhooks → *Create webhook* for `Product creation/update/deletion`, `Collection creation/update/deletion` and `Inventory level update`. Use format JSON and the URL `https://your-domain.com/api/revalidate`. Copy the signing key shown on that page into `SHOPIFY_WEBHOOK_SECRET`. Menu and metaobject edits appear within `SHOPIFY_REVALIDATE_SECONDS`.

## Routes

`/` home · `/shop` · `/jewelry` · `/{clothing|jewelry}/collections/[handle]` · `/{clothing|jewelry}/products/[handle]` · `/search` · `/cart` · `/wishlist` · `/pages/[handle]` · `/policies/[handle]` · `/lookbook` · `/about`. Shopify-style `/collections/x` and `/products/x` links redirect automatically.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
