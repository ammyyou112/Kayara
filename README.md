# KAYRA

KAYRA is a headless luxury fashion and jewelry storefront built with Next.js 15, React 19, TypeScript, Tailwind CSS, GSAP, Motion, and Lenis.

## Architecture

- `app/` uses the Next.js App Router for the split landing page and the future clothing, jewelry, collection, product, search, and cart routes.
- `components/landing/` contains the cinematic split landing experience.
- `components/motion/` contains site-wide Lenis smooth scrolling and route fade transitions.
- `lib/shop/` defines a clean commerce interface with a mock adapter now and a Shopify adapter slot for launch.

## Design Systems

The site is built around two token families in `app/globals.css`.

- Clothing: ivory, plaster, clay, walnut, warm gold, high-contrast serif display, calm editorial pacing.
- Jewelry: near-black, warm charcoal, umber, champagne, pearl, reverent macro-product pacing.

The current typography uses system fallbacks shaped to match the brief. A final licensed display serif and grotesque can be swapped into the CSS variables.

## Animation

The landing includes a monogram loader, masked split reveal, hover expansion, custom cursor, cursor-aware parallax, route transitions, and reduced-motion fallbacks. Lenis is synced to GSAP ScrollTrigger for later pinned lookbook sections.

## Shopify

The UI reads through `lib/shop/index.ts`. During design, `NEXT_PUBLIC_SHOP_ADAPTER=mock` uses fixtures. To connect Shopify later:

1. Set `SHOPIFY_STORE_DOMAIN`.
2. Set `SHOPIFY_STOREFRONT_ACCESS_TOKEN`.
3. Set `NEXT_PUBLIC_SHOP_ADAPTER=shopify`.
4. Implement the GraphQL calls inside `lib/shop/shopify-adapter.ts` without changing the UI contract.

## Scripts

- `npm run dev`
- `npm run build`
- `npm run typecheck`
