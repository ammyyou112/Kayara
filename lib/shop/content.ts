// Default text and imagery for every editable section of the storefront.
//
// Each entry matches a "Content block" metaobject in Shopify (type
// `content_block`) whose Placement field equals the key below. Any field left
// empty in Shopify falls back to the value here, so a section never renders
// blank. `npm run shopify:setup` seeds Shopify with this text.
//
// Keys ending in -1, -2 … are lists (e.g. lookbook-chapter-*): once any entry
// with that prefix exists in Shopify, only the Shopify entries are shown.
//
// This file has no runtime imports so the setup script can load it directly.

import type { ContentBlockDefaults } from "./types";

const unsplash = (id: string, w = 1600): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const img = (id: string, altText: string, w = 2000) => ({ url: unsplash(id, w), altText });

const statement: ContentBlockDefaults = {
  eyebrow: "Est. Karachi",
  title: "We are KAYRA",
  body: "A cinematic South Asian house of pret, bridal, and heirloom jewelry — shaped slowly and finished by hand.",
  ctaLabel: "Discover the House",
  ctaLink: "/about"
};

export const defaultContentBlocks: Record<string, ContentBlockDefaults> = {
  // --- Homepage -------------------------------------------------------------
  "home-featured": {
    eyebrow: "The House of KAYRA",
    title: "Featured Collections",
    ctaLabel: "View all",
    ctaLink: "/shop"
  },
  "home-trending": {
    eyebrow: "Most Wanted",
    title: "Trending Now",
    ctaLink: "/shop"
  },
  "home-new-arrivals": {
    eyebrow: "Just In",
    title: "New Arrivals",
    ctaLabel: "View all arrivals",
    ctaLink: "/shop?sort=newest"
  },
  "home-editorial": {
    eyebrow: "The KAYRA Journal",
    title: "Editorial",
    ctaLabel: "Issue 01",
    ctaLink: "/lookbook"
  },
  "home-editorial-story": {
    eyebrow: "The Story",
    title: "A warm formal evening, in three acts",
    body: "From the first drape of ivory to the last champagne glint — a slow look at the pieces shaped for the occasion, and the hands behind them.",
    ctaLabel: "Read the lookbook",
    ctaLink: "/lookbook",
    images: [
      img("1502716119720-b23a93e5fe1b", "Candlelight, clay & gold", 1600),
      img("1612817159949-195b6eb9e31a", "Held breath, near-black velvet", 1600)
    ]
  },
  "home-editorial-quote": {
    title: "Luxury is the quiet of a room that has been considered."
  },
  "home-statement": {
    ...statement,
    images: [img("1483985988355-763728e1935b", "The house of KAYRA", 2200)]
  },
  "home-instagram": {
    eyebrow: "Follow the House",
    ctaLabel: "Follow on Instagram"
  },

  // --- Shop -----------------------------------------------------------------
  "shop-header": {
    eyebrow: "The Maison"
  },

  // --- Jewelry --------------------------------------------------------------
  "jewelry-cover": {
    eyebrow: "The Jewelry Edit",
    subtitle: "Issue 01 · Ceremony 2026",
    body: "Gold, pearl & champagne — composed for the closest looking.",
    ctaLabel: "Enter the Collection",
    collection: "heirloom",
    images: [img("1602173574767-37ac01994b2a", "KAYRA Jewelry — the Edit")]
  },
  "jewelry-letter": {
    eyebrow: "Editor’s Letter",
    body: "Jewelry is the most personal luxury — read slowly, at arm’s length, in the warmth of an occasion. This edit gathers the pieces meant to be kept and passed on: a champagne glint at the ear, gold close at the throat, a single pearl held in a quiet band."
  },
  "jewelry-categories": {
    eyebrow: "Find your piece",
    title: "Shop by Category"
  },
  "jewelry-slider": {
    eyebrow: "The House of Heirloom",
    title: "Worn close, kept for life",
    body: "Gold, pearl, and champagne — pieces made to be handed down.",
    images: [
      img("1611591437281-460bfbe1220a", "Heirloom jewelry", 2200),
      img("1515562141207-7a88fb7ce338", "Gold and pearl", 2200),
      img("1602173574767-37ac01994b2a", "Champagne jewelry", 2200)
    ]
  },
  "jewelry-feature": {
    subtitle: "01",
    title: "The Champagne Story",
    body: "Warm gold and a restrained champagne tone, set for evening light. Worn one piece at a time, never a crowd.",
    ctaLabel: "Read the chapter",
    images: [img("1515562141207-7a88fb7ce338", "Champagne macro", 1600)]
  },
  "jewelry-edit": {
    title: "The Edit",
    ctaLabel: "Shop all",
    ctaLink: "/shop?world=jewelry"
  },
  "jewelry-quote": {
    title: "The most personal luxury is the one you keep, and the one you pass on.",
    subtitle: "— The House of KAYRA"
  },
  "jewelry-statement": {
    ...statement,
    images: [img("1539109136881-3be0616acf4b", "The house of KAYRA", 2200)]
  },
  "jewelry-closing": {
    ctaLabel: "Enter the Collection"
  },

  // --- About ----------------------------------------------------------------
  "about-hero": {
    eyebrow: "The House",
    title: "A cinematic luxury house",
    images: [img("1539109136881-3be0616acf4b", "The KAYRA house", 1400)]
  },
  "about-story": {
    body: "KAYRA was founded to dress the warm, formal occasions of South Asian life — the wedding guest, the bride, the heirloom passed between hands. We work between two worlds: warm editorial pret and a jewel-box of gold, pearl, and champagne."
  },
  "about-value-1": {
    title: "Hand-finished",
    body: "Every piece is shaped slowly and finished by hand in our ateliers.",
    position: 1
  },
  "about-value-2": {
    title: "Considered materials",
    body: "Silk, fine gold, and pearl, chosen for how they hold light up close.",
    position: 2
  },
  "about-value-3": {
    title: "Made for the occasion",
    body: "Formal pret, bridal, and jewelry composed for the moments that matter.",
    position: 3
  },
  "about-atelier": {
    eyebrow: "The Atelier",
    title: "Slow craft, close looking",
    body: "Our pieces are built to be seen from arm’s length — the fall of a hem, the set of a stone. Client care is personal; reach us for sizing, bespoke, and delivery.",
    ctaLabel: "Explore the Maison",
    ctaLink: "/shop",
    images: [img("1556905055-8f358a7a47b2", "Inside the atelier", 1400)]
  },

  // --- Lookbook -------------------------------------------------------------
  "lookbook-cover": {
    eyebrow: "Lookbook — Ceremony 2026",
    title: "The Edit",
    images: [img("1502716119720-b23a93e5fe1b", "KAYRA lookbook", 1600)]
  },
  "lookbook-chapter-1": {
    title: "Candlelight",
    body: "Ivory drape and clay light, cut for the warm formal evening.",
    ctaLabel: "Shop the chapter",
    ctaLink: "/clothing/collections/luxe-pret",
    images: [img("1612817159949-195b6eb9e31a", "Candlelight", 1600)],
    position: 1
  },
  "lookbook-chapter-2": {
    title: "The Vow",
    body: "Architectural bridal forms, softened by hand at every seam.",
    ctaLabel: "Shop the chapter",
    ctaLink: "/clothing/collections/bridal",
    images: [img("1573408301185-9146fe634ad0", "The Vow", 1600)],
    position: 2
  },
  "lookbook-chapter-3": {
    title: "Held Breath",
    body: "Gold, pearl, and champagne composed for the closest looking.",
    ctaLabel: "Shop the chapter",
    ctaLink: "/jewelry/collections/heirloom",
    images: [img("1617038220319-276d3cfab638", "Held Breath", 1600)],
    position: 3
  },

  // --- Product page ---------------------------------------------------------
  // Shown as a "Size guide" panel on products with a Size option, once it has
  // text or a chart image in Shopify. No default, so nothing invented shows.
  "size-guide": {
    title: "Size guide"
  }
};
