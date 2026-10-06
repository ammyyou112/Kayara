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

### 3. Create the content fields (one command)

The site's editable text and images live in Shopify **metaobjects**. A script creates them for you and fills them with the current website text:

1. Get an Admin API credential with the scopes `write_metaobject_definitions` and `write_metaobjects` (add `write_customers` for newsletter signups). Either:
   - an existing custom app's Admin API access token (`shpat_…`), or
   - an app created in the Shopify **Dev Dashboard**, installed on your store: copy its client ID and client secret.
2. Create `.env.local` in the project folder:
   ```
   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
   # or instead of the token:
   # SHOPIFY_ADMIN_CLIENT_ID=...
   # SHOPIFY_ADMIN_CLIENT_SECRET=...
   ```
3. Run `npm run shopify:setup`.

It is safe to run again: it only adds what is missing and never overwrites your edits. (You can also create the definitions by hand with the fields listed below; turn on **Storefronts** access for each.)

### 4. Manage everything in Shopify admin

| What on the site | Where in Shopify |
|---|---|
| Products, prices, sizes/colours, stock, images | Products (sizes and colours are product **variants/options**) |
| Clothing vs Jewelry | Product **type** or a **tag** containing "jewelry" (anything else is clothing). Optional metafield `custom.world` |
| Categories / collections | Products → Collections (image, description). Optional metafields: `custom.subtitle` (small line above the title) and `custom.world` |
| Header menu | Online Store → Navigation → **Main menu** (`main-menu`). Nested items become dropdowns |
| Footer columns | Navigation → **Footer menu** (`footer`). Each top-level item is a column heading, its children are the links |
| Homepage hero slider | Content → Metaobjects → **Hero slide** (one entry per slide) |
| Announcement bar, contact email/phone, WhatsApp, address, hours, social links, Instagram, homepage picks, SEO | Content → Metaobjects → **Site settings** (one entry) |
| Every other heading, paragraph, button and image on Home, Jewelry, About, Lookbook, Shop and the size guide | Content → Metaobjects → **Content block** (see placements below) |
| About story | Online Store → Pages → **About** (handle `about`), or the `about-story` content block |
| Contact / any other page | Online Store → Pages (`/pages/<handle>`). The contact page also lists the contact details from Site settings |
| Shipping / Returns / Privacy / Terms | Settings → Policies (`/policies/shipping-policy` etc.) |
| Newsletter subscribers | Customers (email marketing: Subscribed), when `SHOPIFY_ADMIN_ACCESS_TOKEN` is set on Vercel |

Any field left empty falls back to the built-in default (`lib/shop/content.ts`, `lib/shop/defaults.ts`), so the site never renders blank.

**Site settings** (`site_settings`): `announcement`, `announcement_secondary`, `tagline`, `footer_note`, `contact_email`, `contact_phone`, `whatsapp_number` (with country code; shows a floating WhatsApp button and a footer link), `address`, `business_hours`, `instagram_handle`, `instagram_url`, `facebook_url`, `tiktok_url`, `youtube_url`, `pinterest_url`, `x_url`, `snapchat_url`, `whatsapp_url`, `instagram_images` (images), `featured_collections` (collections), `trending_collection` (collection), `seo_title`, `seo_description`.

**Hero slide** (`hero_slide`): `image`, `eyebrow`, `title`, `cta_label`, `link` (path such as `/collections/bridal` or a full URL), `position`.

**Content block** (`content_block`): `placement`, `eyebrow`, `title`, `subtitle`, `body` (blank line = new paragraph), `images`, `cta_label`, `cta_link`, `collection`, `position`. The **placement** decides where it shows:

| Page | Placements |
|---|---|
| Home | `home-featured`, `home-trending`, `home-new-arrivals`, `home-editorial`, `home-editorial-story` (2 images; alt text = caption), `home-editorial-quote` (title = quote), `home-statement`, `home-instagram` |
| Shop | `shop-header` |
| Jewelry | `jewelry-cover` (collection = featured jewelry collection), `jewelry-letter`, `jewelry-categories`, `jewelry-slider`, `jewelry-feature`, `jewelry-edit`, `jewelry-quote`, `jewelry-statement`, `jewelry-closing` |
| About | `about-hero`, `about-story`, `about-value-1`, `about-value-2`, … |
| Lookbook | `lookbook-cover`, `lookbook-chapter-1`, `lookbook-chapter-2`, … |
| Product page | `size-guide` (text and/or a size-chart image; shows on products with a Size option) |

Lists (`about-value-*`, `lookbook-chapter-*`): add another entry with the next number to add an item, delete one to remove it, and use `position` to reorder.

### 5. Instant updates (webhooks)

Settings → Notifications → Webhooks → *Create webhook* for `Product creation/update/deletion`, `Collection creation/update/deletion` and `Inventory level update`. Use format JSON and the URL `https://your-domain.com/api/revalidate`. Copy the signing key shown on that page into `SHOPIFY_WEBHOOK_SECRET`. Menu and metaobject edits appear within `SHOPIFY_REVALIDATE_SECONDS` (5 minutes by default); to see them immediately, `curl -X POST "https://your-domain.com/api/revalidate?secret=$REVALIDATE_SECRET"`.

## Routes

`/` home · `/shop` · `/jewelry` · `/{clothing|jewelry}/collections/[handle]` · `/{clothing|jewelry}/products/[handle]` · `/search` · `/cart` · `/wishlist` · `/pages/[handle]` · `/policies/[handle]` · `/lookbook` · `/about`. Shopify-style `/collections/x` and `/products/x` links redirect automatically.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run shopify:setup` (creates the Shopify content fields, see step 3)
