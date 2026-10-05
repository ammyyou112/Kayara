import { unsplash } from "../images";
import type { HeroSlide, MenuItem, Page, SiteSettings } from "./types";

// Fallback content. The mock adapter serves these directly; the Shopify adapter
// uses them only when the matching menu / metaobject / page has not been set up
// in the Shopify admin yet, so the storefront never renders empty.

const link = (title: string, href: string, items: MenuItem[] = []): MenuItem => ({
  title,
  href,
  items
});

export const defaultMainMenu: MenuItem[] = [
  link("Clothing", "/shop?world=clothing", [
    link("Luxe Pret", "/clothing/collections/luxe-pret"),
    link("Bridal", "/clothing/collections/bridal")
  ]),
  link("Jewelry", "/jewelry", [link("Heirloom", "/jewelry/collections/heirloom")]),
  link("Shop All", "/shop"),
  link("Lookbook", "/lookbook"),
  link("About", "/about")
];

export const defaultFooterMenu: MenuItem[] = [
  link("Shop", "", [
    link("Clothing", "/shop?world=clothing"),
    link("Jewelry", "/jewelry"),
    link("Shop All", "/shop"),
    link("Search", "/search")
  ]),
  link("Collections", "", [
    link("Luxe Pret", "/clothing/collections/luxe-pret"),
    link("Bridal", "/clothing/collections/bridal"),
    link("Heirloom", "/jewelry/collections/heirloom")
  ]),
  link("House", "", [
    link("About", "/about"),
    link("Lookbook", "/lookbook"),
    link("Wishlist", "/wishlist"),
    link("The KAYRA List", "#newsletter")
  ]),
  link("Client Care", "", [
    link("Shipping & Delivery", "/policies/shipping-policy"),
    link("Returns & Exchanges", "/policies/refund-policy"),
    link("Contact", "/pages/contact")
  ])
];

export const defaultSiteSettings: SiteSettings = {
  announcement: "Complimentary shipping nationwide",
  announcementSecondary: "WhatsApp +92 317 0 KAYRA",
  tagline:
    "A cinematic South Asian luxury house — formal pret, bridal, and heirloom jewelry.",
  footerNote: "Prices in PKR · Worldwide shipping",
  socials: [],
  instagramHandle: "@kayra",
  instagramUrl: "",
  instagramImages: [
    "1502716119720-b23a93e5fe1b",
    "1612817159949-195b6eb9e31a",
    "1573408301185-9146fe634ad0",
    "1617038220319-276d3cfab638",
    "1515377905703-c4788e51af15",
    "1556905055-8f358a7a47b2"
  ].map((id, i) => ({ url: unsplash(id, 800), altText: `KAYRA on Instagram ${i + 1}` })),
  featuredCollections: [],
  trendingCollection: ""
};

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: "pret",
    image: { url: unsplash("1490481651871-ab68de25d43d", 2200), altText: "Luxe Pret campaign" },
    href: "/clothing/collections/luxe-pret",
    eyebrow: "Luxe Pret — The Wedding Guest",
    title: "Warm Editorial Pret",
    cta: "Shop Pret"
  },
  {
    id: "bridal",
    image: { url: unsplash("1591369822096-ffd140ec948f", 2200), altText: "Bridal campaign" },
    href: "/clothing/collections/bridal",
    eyebrow: "Bridal — Ceremony 2026",
    title: "The Vow Collection",
    cta: "Discover Bridal"
  },
  {
    id: "heirloom",
    image: {
      url: unsplash("1602173574767-37ac01994b2a", 2200),
      altText: "Heirloom jewelry campaign"
    },
    href: "/jewelry/collections/heirloom",
    eyebrow: "Heirloom — The Jewel Box",
    title: "Gold, Pearl & Champagne",
    cta: "Enter the Edit"
  },
  {
    id: "editorial",
    image: { url: unsplash("1539109136881-3be0616acf4b", 2200), altText: "Clothing editorial" },
    href: "/shop?world=clothing",
    eyebrow: "Atelier — New Season",
    title: "Made for the Occasion",
    cta: "Shop Clothing"
  },
  {
    id: "jewel",
    image: { url: unsplash("1611591437281-460bfbe1220a", 2200), altText: "Jewelry editorial" },
    href: "/jewelry",
    eyebrow: "The House of Heirloom",
    title: "Worn Close, Kept for Life",
    cta: "Shop Jewelry"
  }
];

const paragraphs = (...lines: string[]) => lines.map((line) => `<p>${line}</p>`).join("");

export const defaultPages: Record<string, Page> = {
  contact: {
    handle: "contact",
    title: "Contact",
    body: paragraphs(
      "Our client care team is available Monday to Saturday, 11am – 7pm PKT.",
      "WhatsApp: +92 317 0 KAYRA",
      "Email: care@kayra.com"
    )
  }
};

export const defaultPolicies: Record<string, Page> = {
  "shipping-policy": {
    handle: "shipping-policy",
    title: "Shipping & Delivery",
    body: paragraphs(
      "Complimentary shipping on all orders within Pakistan. Ready-to-wear pieces dispatch within 3–5 working days.",
      "Bridal and made-to-order pieces are finished by hand; your atelier contact will confirm a delivery date when you order.",
      "International shipping is available worldwide. Duties and taxes are calculated at checkout."
    )
  },
  "refund-policy": {
    handle: "refund-policy",
    title: "Returns & Exchanges",
    body: paragraphs(
      "Ready-to-wear pieces may be exchanged within 7 days of delivery, unworn and with tags attached.",
      "Bridal, made-to-order, and altered pieces are final sale.",
      "To start an exchange, contact client care with your order number."
    )
  },
  "privacy-policy": {
    handle: "privacy-policy",
    title: "Privacy Policy",
    body: paragraphs("We only use your details to fulfil orders and, if you opt in, to send news from the house.")
  },
  "terms-of-service": {
    handle: "terms-of-service",
    title: "Terms of Service",
    body: paragraphs("By shopping with KAYRA you agree to our shipping, returns, and privacy policies.")
  }
};
