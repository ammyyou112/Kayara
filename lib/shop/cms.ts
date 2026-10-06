// What the store owner sees in Shopify admin → Content → Metaobjects, and
// where each field shows on the website. One definition per part of the site,
// with fields in the same order as on the page, named in plain words.
//
// `to` says where a field's value goes:
//   "home-featured.title"   → a section of a page (see lib/shop/content.ts)
//   "settings.tagline"      → a store-wide setting (SiteSettings)
//   "settings.social.X"     → a social media link labelled X
//   "item.title"            → one entry of a list (slides, chapters, values)
//
// The website (lib/shop/shopify-adapter.ts) and the setup script
// (scripts/shopify-setup.ts) both read this file, so it has no runtime imports.

export type CmsFieldType =
  | "text"
  | "longText"
  | "url"
  | "image"
  | "images"
  | "collection"
  | "collections"
  | "number"
  | "textList"
  | "boolean";

export type CmsField = {
  key: string;
  name: string;
  type: CmsFieldType;
  to: string;
  help?: string;
};

export type CmsDefinition = {
  type: string;
  name: string;
  help: string;
  /** Repeatable entries (slides, chapters…); the value is the list's name in the code. */
  list?: string;
  /** Handle of the single entry, for non-list definitions. */
  entry?: string;
  displayField?: string;
  fields: CmsField[];
};

const KEEP_PHOTO = "Leave empty to keep the current photo.";
const LINK_HELP = "Where the button goes, e.g. /shop or /collections/bridal";

type Part = "smallText" | "title" | "text" | "buttonText" | "buttonLink" | "picture" | "pictures";

/** The usual fields of one page section, named "2 · Trending — Title" etc. */
const section = (
  label: string,
  prefix: string,
  block: string,
  parts: Part[],
  extra: CmsField[] = []
): CmsField[] => {
  const name = (what: string) => `${label} — ${what}`;
  const fields: Record<Part, CmsField> = {
    picture: {
      key: `${prefix}_picture`,
      name: name("Picture"),
      type: "image",
      to: `${block}.images`,
      help: KEEP_PHOTO
    },
    pictures: {
      key: `${prefix}_pictures`,
      name: name("Pictures"),
      type: "images",
      to: `${block}.images`,
      help: KEEP_PHOTO
    },
    smallText: {
      key: `${prefix}_small_text`,
      name: name("Small text above the title"),
      type: "text",
      to: `${block}.eyebrow`
    },
    title: { key: `${prefix}_title`, name: name("Title"), type: "text", to: `${block}.title` },
    text: {
      key: `${prefix}_text`,
      name: name("Text"),
      type: "longText",
      to: `${block}.body`,
      help: "Leave a blank line between paragraphs."
    },
    buttonText: {
      key: `${prefix}_button_text`,
      name: name("Button text"),
      type: "text",
      to: `${block}.ctaLabel`
    },
    buttonLink: {
      key: `${prefix}_button_link`,
      name: name("Button link"),
      type: "text",
      to: `${block}.ctaLink`,
      help: LINK_HELP
    }
  };
  return [...parts.map((part) => fields[part]), ...extra];
};

export const cmsDefinitions: CmsDefinition[] = [
  {
    type: "announcement_bar",
    name: "📣 Announcement bar (top of the website)",
    help: "The thin bar at the very top of every page.",
    entry: "announcement-bar",
    fields: [
      {
        key: "messages",
        name: "Messages",
        type: "textList",
        to: "settings.announcements",
        help: "Click “Add item” to add another message. Delete them all to hide the bar."
      },
      {
        key: "scrolling",
        name: "Make the messages scroll (running text)",
        type: "boolean",
        to: "settings.announcementScroll",
        help: "On = messages run across the bar. Off = they stand still."
      }
    ]
  },
  {
    type: "contact_details",
    name: "📞 Contact & WhatsApp",
    help: "Shown in the footer and on the Contact page. Empty fields are hidden.",
    entry: "contact-details",
    fields: [
      {
        key: "whatsapp_number",
        name: "WhatsApp number",
        type: "text",
        to: "settings.whatsappNumber",
        help: "With country code, e.g. +92 300 1234567. A green WhatsApp button appears on every page."
      },
      {
        key: "whatsapp_message",
        name: "WhatsApp ready-made message",
        type: "text",
        to: "settings.whatsappMessage",
        help: "Optional. Already typed for the customer when they open WhatsApp, e.g. Hi KAYRA, I have a question."
      },
      { key: "email", name: "Email", type: "text", to: "settings.contactEmail" },
      { key: "phone", name: "Phone", type: "text", to: "settings.contactPhone" },
      { key: "address", name: "Address", type: "longText", to: "settings.address" },
      {
        key: "opening_hours",
        name: "Opening hours",
        type: "longText",
        to: "settings.businessHours",
        help: "e.g. Mon–Sat, 11am – 7pm"
      }
    ]
  },
  {
    type: "social_links",
    name: "🌐 Social media links",
    help: "Paste the full link to each profile. Empty ones are hidden.",
    entry: "social-links",
    fields: [
      { key: "instagram", name: "Instagram", type: "url", to: "settings.social.Instagram" },
      { key: "facebook", name: "Facebook", type: "url", to: "settings.social.Facebook" },
      { key: "tiktok", name: "TikTok", type: "url", to: "settings.social.TikTok" },
      { key: "youtube", name: "YouTube", type: "url", to: "settings.social.YouTube" },
      { key: "pinterest", name: "Pinterest", type: "url", to: "settings.social.Pinterest" },
      { key: "x_twitter", name: "X (Twitter)", type: "url", to: "settings.social.X" },
      { key: "snapchat", name: "Snapchat", type: "url", to: "settings.social.Snapchat" }
    ]
  },
  {
    type: "footer",
    name: "🦶 Footer (bottom of the website)",
    help: "The footer link columns are edited in Online Store → Navigation → Footer menu. Contact details and social links come from their own sections.",
    entry: "footer",
    fields: [
      { key: "tagline", name: "Text under the KAYRA logo", type: "longText", to: "settings.tagline" },
      {
        key: "newsletter_title",
        name: "Newsletter sign-up title",
        type: "text",
        to: "settings.newsletterTitle"
      },
      {
        key: "bottom_note",
        name: "Small note at the very bottom",
        type: "text",
        to: "settings.footerNote",
        help: "e.g. Prices in PKR · Worldwide shipping"
      }
    ]
  },
  {
    type: "homepage_slide",
    name: "🖼️ Homepage slider (big pictures at the top)",
    help: "One entry = one slide. Add, delete or reorder slides here. Until you add one, the built-in slides show.",
    list: "hero-slide",
    displayField: "title",
    fields: [
      { key: "picture", name: "Picture", type: "image", to: "item.images", help: "A wide photo looks best." },
      { key: "small_text", name: "Small text above the title", type: "text", to: "item.eyebrow" },
      { key: "title", name: "Title", type: "text", to: "item.title" },
      { key: "button_text", name: "Button text", type: "text", to: "item.ctaLabel" },
      { key: "button_link", name: "Button link", type: "text", to: "item.ctaLink", help: LINK_HELP },
      { key: "order", name: "Order", type: "number", to: "item.position", help: "1 shows first, then 2, 3…" }
    ]
  },
  {
    type: "homepage",
    name: "🏠 Homepage",
    help: "All the text and pictures on the homepage, from top to bottom. The big slider at the top is in “Homepage slider”.",
    entry: "homepage",
    fields: [
      ...section("1 · Featured collections", "featured", "home-featured", ["smallText", "title"], [
        {
          key: "featured_collections",
          name: "1 · Featured collections — Which collections to show",
          type: "collections",
          to: "settings.featuredCollections",
          help: "Pick them in the order you want. Empty = the first 6 collections."
        }
      ]),
      ...section("1 · Featured collections", "featured", "home-featured", ["buttonText", "buttonLink"]),
      ...section("2 · Trending", "trending", "home-trending", ["smallText", "title"], [
        {
          key: "trending_collection",
          name: "2 · Trending — Which collection to show",
          type: "collection",
          to: "settings.trendingCollection",
          help: "Empty = best sellers."
        }
      ]),
      ...section("2 · Trending", "trending", "home-trending", ["buttonLink"]),
      ...section("3 · New arrivals", "arrivals", "home-new-arrivals", [
        "smallText",
        "title",
        "buttonText",
        "buttonLink"
      ]),
      ...section("4 · Editorial", "editorial", "home-editorial", [
        "smallText",
        "title",
        "buttonText",
        "buttonLink"
      ]),
      ...section("4 · Editorial story", "story", "home-editorial-story", [
        "pictures",
        "smallText",
        "title",
        "text",
        "buttonText",
        "buttonLink"
      ]),
      {
        key: "quote_text",
        name: "4 · Editorial — Quote under the story",
        type: "text",
        to: "home-editorial-quote.title"
      },
      ...section("5 · We are KAYRA", "about", "home-statement", [
        "pictures",
        "smallText",
        "title",
        "text",
        "buttonText",
        "buttonLink"
      ]),
      ...section("6 · Instagram", "instagram", "home-instagram", ["smallText"], [
        {
          key: "instagram_handle",
          name: "6 · Instagram — Your @name",
          type: "text",
          to: "settings.instagramHandle",
          help: "The Instagram link itself is in “Social media links”."
        }
      ]),
      ...section("6 · Instagram", "instagram", "home-instagram", ["buttonText"], [
        {
          key: "instagram_pictures",
          name: "6 · Instagram — Pictures",
          type: "images",
          to: "settings.instagramImages",
          help: "Up to 6. " + KEEP_PHOTO
        }
      ])
    ]
  },
  {
    type: "shop_page",
    name: "🛍️ Shop page",
    help: "The page that lists all products (/shop).",
    entry: "shop-page",
    fields: section("Top", "top", "shop-header", ["smallText"])
  },
  {
    type: "jewelry_page",
    name: "💎 Jewelry page",
    help: "All the text and pictures on the Jewelry page, from top to bottom.",
    entry: "jewelry-page",
    fields: [
      ...section("1 · Cover", "cover", "jewelry-cover", ["picture", "smallText", "title"]),
      {
        key: "cover_corner_text",
        name: "1 · Cover — Small text in the top corner",
        type: "text",
        to: "jewelry-cover.subtitle"
      },
      ...section("1 · Cover", "cover", "jewelry-cover", ["text", "buttonText", "buttonLink"], [
        {
          key: "cover_collection",
          name: "1 · Cover — Featured jewelry collection",
          type: "collection",
          to: "jewelry-cover.collection",
          help: "Its name is used as the big title when the title above is empty."
        }
      ]),
      ...section("2 · Letter", "letter", "jewelry-letter", ["smallText", "text"]),
      ...section("3 · Shop by category", "categories", "jewelry-categories", ["smallText", "title"]),
      ...section("4 · Slideshow", "slider", "jewelry-slider", [
        "pictures",
        "smallText",
        "title",
        "text"
      ]),
      {
        key: "feature_number",
        name: "5 · Story — Big number",
        type: "text",
        to: "jewelry-feature.subtitle"
      },
      ...section("5 · Story", "feature", "jewelry-feature", [
        "picture",
        "title",
        "text",
        "buttonText",
        "buttonLink"
      ]),
      ...section("6 · Product list", "edit", "jewelry-edit", ["title", "buttonText", "buttonLink"]),
      { key: "quote_text", name: "7 · Quote — Text", type: "text", to: "jewelry-quote.title" },
      { key: "quote_author", name: "7 · Quote — Who said it", type: "text", to: "jewelry-quote.subtitle" },
      ...section("8 · We are KAYRA", "about", "jewelry-statement", [
        "pictures",
        "smallText",
        "title",
        "text",
        "buttonText",
        "buttonLink"
      ]),
      ...section("9 · Last section", "closing", "jewelry-closing", [
        "smallText",
        "title",
        "buttonText",
        "buttonLink"
      ])
    ]
  },
  {
    type: "about_page",
    name: "📖 About page",
    help: "All the text and pictures on the About page. The values (three short points) are in “About page — values”.",
    entry: "about-page",
    fields: [
      ...section("1 · Top", "top", "about-hero", ["picture", "smallText", "title"]),
      {
        key: "story_text",
        name: "2 · Our story — Text",
        type: "longText",
        to: "about-story.body",
        help: "Leave a blank line between paragraphs. (If you make a page called “About” in Online Store → Pages, that page’s text is used instead.)"
      },
      ...section("3 · Atelier", "atelier", "about-atelier", [
        "picture",
        "smallText",
        "title",
        "text",
        "buttonText",
        "buttonLink"
      ])
    ]
  },
  {
    type: "about_value",
    name: "⭐ About page — values",
    help: "The short points on the About page. One entry = one point.",
    list: "about-value",
    displayField: "title",
    fields: [
      { key: "title", name: "Title", type: "text", to: "item.title" },
      { key: "text", name: "Text", type: "longText", to: "item.body" },
      { key: "order", name: "Order", type: "number", to: "item.position", help: "1 shows first, then 2, 3…" }
    ]
  },
  {
    type: "lookbook_page",
    name: "📸 Lookbook page",
    help: "The cover of the Lookbook page. The chapters are in “Lookbook — chapters”.",
    entry: "lookbook-page",
    fields: section("Cover", "cover", "lookbook-cover", ["picture", "smallText", "title"])
  },
  {
    type: "lookbook_chapter",
    name: "📸 Lookbook — chapters",
    help: "One entry = one chapter (picture + text) on the Lookbook page.",
    list: "lookbook-chapter",
    displayField: "title",
    fields: [
      { key: "picture", name: "Picture", type: "image", to: "item.images", help: KEEP_PHOTO },
      { key: "number", name: "Big number", type: "text", to: "item.subtitle", help: "e.g. 01. Empty = counted automatically." },
      { key: "title", name: "Title", type: "text", to: "item.title" },
      { key: "text", name: "Text", type: "longText", to: "item.body" },
      { key: "button_text", name: "Button text", type: "text", to: "item.ctaLabel" },
      { key: "button_link", name: "Button link", type: "text", to: "item.ctaLink", help: LINK_HELP },
      { key: "order", name: "Order", type: "number", to: "item.position", help: "1 shows first, then 2, 3…" }
    ]
  },
  {
    type: "size_guide",
    name: "📏 Size guide",
    help: "Shows as “Size guide” on every product that has a Size option, once it has text or a chart.",
    entry: "size-guide",
    fields: [
      { key: "title", name: "Title", type: "text", to: "size-guide.title" },
      { key: "text", name: "Text", type: "longText", to: "size-guide.body" },
      { key: "chart", name: "Size chart pictures", type: "images", to: "size-guide.images" }
    ]
  },
  {
    type: "google_search",
    name: "🔍 Google search (SEO)",
    help: "How the homepage looks in Google results and in the browser tab.",
    entry: "google-search",
    fields: [
      { key: "title", name: "Title", type: "text", to: "settings.seoTitle" },
      { key: "description", name: "Description", type: "longText", to: "settings.seoDescription" }
    ]
  }
];

/** Splits a field's `to` into what it targets. */
export const parseTarget = (
  to: string
):
  | { kind: "settings"; prop: string }
  | { kind: "social"; label: string }
  | { kind: "item"; prop: string }
  | { kind: "block"; block: string; prop: string } => {
  if (to.startsWith("settings.social.")) {
    return { kind: "social", label: to.slice("settings.social.".length) };
  }
  if (to.startsWith("settings.")) {
    return { kind: "settings", prop: to.slice("settings.".length) };
  }
  if (to.startsWith("item.")) {
    return { kind: "item", prop: to.slice("item.".length) };
  }
  const dot = to.lastIndexOf(".");
  return { kind: "block", block: to.slice(0, dot), prop: to.slice(dot + 1) };
};
