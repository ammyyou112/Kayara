// Curated, verified remote imagery (Unsplash). Centralised so the look can be
// swapped to licensed brand photography by editing one file.

export const unsplash = (id: string, w = 1600): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export type HeroSlide = {
  id: string;
  image: string;
  eyebrow: string;
  title: string;
  copy: string;
  ctaLabel: string;
  href: string;
};

export const clothingHeroSlides: HeroSlide[] = [
  {
    id: "bridal",
    image: unsplash("1591369822096-ffd140ec948f", 2000),
    eyebrow: "Bridal — Ceremony 2026",
    title: "The Vow Collection",
    copy: "Architectural bridal forms in ivory and warm gold, finished by hand.",
    ctaLabel: "Discover Bridal",
    href: "/clothing/collections/bridal"
  },
  {
    id: "pret",
    image: unsplash("1490481651871-ab68de25d43d", 2000),
    eyebrow: "Luxe Pret — The Wedding Guest",
    title: "Warm Editorial Pret",
    copy: "Ivory drape, clay light, architectural calm for formal evenings.",
    ctaLabel: "Shop Luxe Pret",
    href: "/clothing/collections/luxe-pret"
  },
  {
    id: "season",
    image: unsplash("1502716119720-b23a93e5fe1b", 2000),
    eyebrow: "Atelier — New Season",
    title: "Made for the Occasion",
    copy: "Formal silhouettes shaped slowly, for the moments that matter.",
    ctaLabel: "Shop Clothing",
    href: "/clothing"
  }
];

export const editorial = {
  storyPortrait: unsplash("1539109136881-3be0616acf4b", 1400),
  storyWide: unsplash("1483985988355-763728e1935b", 2000),
  atelier: unsplash("1556905055-8f358a7a47b2", 1400),
  craft: unsplash("1606760227091-3dd870d97f1d", 1400),
  lookbook: [
    unsplash("1502716119720-b23a93e5fe1b", 1600),
    unsplash("1612817159949-195b6eb9e31a", 1600),
    unsplash("1573408301185-9146fe634ad0", 1600),
    unsplash("1617038220319-276d3cfab638", 1600),
    unsplash("1515377905703-c4788e51af15", 1600)
  ]
};

// Jewelry magazine assets
export const jewel = {
  cover: unsplash("1602173574767-37ac01994b2a", 2000),
  macro: unsplash("1515562141207-7a88fb7ce338", 1600),
  spread: [
    unsplash("1611591437281-460bfbe1220a", 1400),
    unsplash("1599643478518-a784e5dc4c8f", 1400)
  ],
  detail: unsplash("1605100804763-247f67b3557e", 1400)
};

// Full-bleed homepage hero campaign slides
export type StoreSlide = {
  id: string;
  image: string;
  href: string;
  alt: string;
};

export const storeHeroSlides: StoreSlide[] = [
  {
    id: "pret",
    image: unsplash("1490481651871-ab68de25d43d", 2200),
    href: "/clothing/collections/luxe-pret",
    alt: "Luxe Pret campaign"
  },
  {
    id: "bridal",
    image: unsplash("1591369822096-ffd140ec948f", 2200),
    href: "/clothing/collections/bridal",
    alt: "Bridal campaign"
  },
  {
    id: "heirloom",
    image: unsplash("1602173574767-37ac01994b2a", 2200),
    href: "/jewelry/collections/heirloom",
    alt: "Heirloom jewelry campaign"
  },
  {
    id: "editorial",
    image: unsplash("1539109136881-3be0616acf4b", 2200),
    href: "/clothing",
    alt: "Clothing editorial"
  },
  {
    id: "jewel",
    image: unsplash("1611591437281-460bfbe1220a", 2200),
    href: "/jewelry",
    alt: "Jewelry editorial"
  },
  {
    id: "season",
    image: unsplash("1502716119720-b23a93e5fe1b", 2200),
    href: "/shop",
    alt: "New season"
  }
];
