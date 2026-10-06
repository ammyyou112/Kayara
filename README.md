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

### 3. Create the content sections (one command)

The website's text and pictures are edited in **Shopify admin → Content → Metaobjects**. A script creates every section and fills it with the current website text:

1. Get an Admin API credential with the scopes `write_metaobject_definitions` and `write_metaobjects` (add `write_customers` for newsletter signups): a custom app token (`shpat_…`), or the client ID and secret of an app made in the Shopify **Dev Dashboard** and installed on the store.
2. Put it in `.env.local`:
   ```
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_ADMIN_CLIENT_ID=...
   SHOPIFY_ADMIN_CLIENT_SECRET=...
   # or: SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
   ```
3. Run `npm run shopify:setup`. Safe to run again: it never changes entries that already exist.

The sections, their fields and where each field shows on the site are defined in `lib/shop/cms.ts` (the script and the website both read it). Empty fields fall back to the built-in text and photos in `lib/shop/content.ts`.

### 4. What to edit where

| On the website | In Shopify admin |
|---|---|
| Running message bar at the top | Metaobjects → 📣 **Announcement bar** (add messages; switch scrolling on/off) |
| WhatsApp button, email, phone, address, hours | Metaobjects → 📞 **Contact & WhatsApp** |
| Instagram, Facebook, TikTok… links | Metaobjects → 🌐 **Social media links** |
| Footer text and newsletter title | Metaobjects → 🦶 **Footer** |
| Footer link columns | Online Store → Navigation → **Footer menu** (top-level item = column title, items under it = links) |
| Header menu | Online Store → Navigation → **Main menu** (nested items become dropdowns) |
| Big pictures at the top of the homepage | Metaobjects → 🖼️ **Homepage slider** (one entry per slide) |
| All other homepage text and pictures | Metaobjects → 🏠 **Homepage** (fields numbered top to bottom) |
| Shop / Jewelry / About / Lookbook pages | Metaobjects → 🛍️ **Shop page**, 💎 **Jewelry page**, 📖 **About page** + ⭐ **values**, 📸 **Lookbook page** + **chapters** |
| Size guide on products | Metaobjects → 📏 **Size guide** (shows on products with a Size option) |
| Google title and description | Metaobjects → 🔍 **Google search (SEO)** |
| Products, prices, sizes/colours, stock | Products (sizes and colours are variants) |
| Clothing vs Jewelry | Product **type** or a **tag** containing "jewelry"; optional metafield `custom.world` |
| Collections / categories | Products → Collections; optional metafields `custom.subtitle`, `custom.world` |
| Contact, FAQ or any other page | Online Store → Pages (`/pages/<handle>`); a page with handle `about` replaces the About story |
| Shipping / Returns / Privacy / Terms | Settings → Policies |

### 5. Instant updates (webhooks)

Settings → Notifications → Webhooks → *Create webhook* for `Product creation/update/deletion`, `Collection creation/update/deletion` and `Inventory level update`. Use format JSON and the URL `https://your-domain.com/api/revalidate`. Copy the signing key shown on that page into `SHOPIFY_WEBHOOK_SECRET`. Menu and metaobject edits appear within `SHOPIFY_REVALIDATE_SECONDS` (5 minutes by default); to see them immediately, `curl -X POST "https://your-domain.com/api/revalidate?secret=$REVALIDATE_SECRET"`.

## Routes

`/` home · `/shop` · `/jewelry` · `/{clothing|jewelry}/collections/[handle]` · `/{clothing|jewelry}/products/[handle]` · `/search` · `/cart` · `/wishlist` · `/pages/[handle]` · `/policies/[handle]` · `/lookbook` · `/about`. Shopify-style `/collections/x` and `/products/x` links redirect automatically.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run shopify:setup` (creates the Shopify content sections, see step 3)
