import type { Collection, Money, Product, World } from "./types";
import { unsplash } from "../images";

const pkr = (amount: number): Money => ({ amount, currencyCode: "PKR" });

type ProductSeed = {
  handle: string;
  title: string;
  world: World;
  collectionHandle: string;
  description: string;
  price: number;
  sizes: string[];
  images: string[];
};

const seeds: ProductSeed[] = [
  {
    handle: "ivory-arch-angrakha",
    title: "Ivory Arch Angrakha",
    world: "clothing",
    collectionHandle: "luxe-pret",
    description:
      "A fluid ivory angrakha with clay edging and soft formal volume, cut for candlelit evenings.",
    price: 68500,
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      unsplash("1469334031218-e382a71b716b", 1100),
      unsplash("1502716119720-b23a93e5fe1b", 1100),
      unsplash("1515377905703-c4788e51af15", 1100)
    ]
  },
  {
    handle: "clay-mehfil-kaftan",
    title: "Clay Mehfil Kaftan",
    world: "clothing",
    collectionHandle: "luxe-pret",
    description:
      "A terracotta formal kaftan cut for movement and warm, low-lit rooms.",
    price: 74200,
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      unsplash("1515372039744-b8f02a3ae446", 1100),
      unsplash("1573408301185-9146fe634ad0", 1100),
      unsplash("1483985988355-763728e1935b", 1100)
    ]
  },
  {
    handle: "walnut-silk-sharara",
    title: "Walnut Silk Sharara",
    world: "clothing",
    collectionHandle: "luxe-pret",
    description:
      "Deep walnut silk sharara with a hand-finished gold hem and architectural drape.",
    price: 81900,
    sizes: ["XS", "S", "M", "L", "XL"],
    images: [
      unsplash("1525507119028-ed4c629a60a3", 1100),
      unsplash("1612817159949-195b6eb9e31a", 1100),
      unsplash("1617038220319-276d3cfab638", 1100)
    ]
  },
  {
    handle: "plaster-vow-gharara",
    title: "Plaster Vow Gharara",
    world: "clothing",
    collectionHandle: "bridal",
    description:
      "A plaster-toned bridal gharara with softened handwork and a quiet, ceremonial weight.",
    price: 184000,
    sizes: ["XS", "S", "M", "L"],
    images: [
      unsplash("1566174053879-31528523f8ae", 1100),
      unsplash("1594552072238-b8a33785b261", 1100),
      unsplash("1591369822096-ffd140ec948f", 1100)
    ]
  },
  {
    handle: "gilded-nikah-lehenga",
    title: "Gilded Nikah Lehenga",
    world: "clothing",
    collectionHandle: "bridal",
    description:
      "Ivory and warm gold nikah lehenga, structured at the waist and luminous in motion.",
    price: 246000,
    sizes: ["XS", "S", "M", "L"],
    images: [
      unsplash("1610030469983-98e550d6193c", 1100),
      unsplash("1591369822096-ffd140ec948f", 1100),
      unsplash("1594552072238-b8a33785b261", 1100)
    ]
  },
  {
    handle: "champagne-kundan-drops",
    title: "Champagne Kundan Drops",
    world: "jewelry",
    collectionHandle: "heirloom",
    description:
      "Warm gold drop earrings with a restrained champagne glint, set for close looking.",
    price: 39500,
    sizes: ["One Size"],
    images: [
      unsplash("1535632066927-ab7c9ab60908", 1100),
      unsplash("1515562141207-7a88fb7ce338", 1100),
      unsplash("1611591437281-460bfbe1220a", 1100)
    ]
  },
  {
    handle: "gold-meena-choker",
    title: "Gold Meena Choker",
    world: "jewelry",
    collectionHandle: "heirloom",
    description:
      "A meenakari choker in warm gold and umber enamel, worn close at the throat.",
    price: 112000,
    sizes: ["One Size"],
    images: [
      unsplash("1605100804763-247f67b3557e", 1100),
      unsplash("1602173574767-37ac01994b2a", 1100),
      unsplash("1599643478518-a784e5dc4c8f", 1100)
    ]
  },
  {
    handle: "pearl-vow-ring",
    title: "Pearl Vow Ring",
    world: "jewelry",
    collectionHandle: "heirloom",
    description:
      "A single pearl held in a fine gold band — a reverent, quiet vow piece.",
    price: 58000,
    sizes: ["6", "7", "8", "9"],
    images: [
      unsplash("1599643478518-a784e5dc4c8f", 1100),
      unsplash("1515562141207-7a88fb7ce338", 1100),
      unsplash("1611591437281-460bfbe1220a", 1100)
    ]
  }
];

export const collections: Collection[] = [
  {
    id: "collection-luxe-pret",
    handle: "luxe-pret",
    title: "Luxe Pret",
    world: "clothing",
    parenthetical: "The Wedding Guest",
    description: "Ivory, clay, and walnut silhouettes for warm formal evenings.",
    heroImage: {
      url: unsplash("1539109136881-3be0616acf4b", 1600),
      altText: "Warm editorial portrait for Luxe Pret garments"
    }
  },
  {
    id: "collection-bridal",
    handle: "bridal",
    title: "Bridal",
    world: "clothing",
    parenthetical: "Ceremony Pieces",
    description: "Architectural bridal forms with softened handwork and light.",
    heroImage: {
      url: unsplash("1594552072238-b8a33785b261", 1600),
      altText: "Architectural bridal look in ivory"
    }
  },
  {
    id: "collection-heirloom",
    handle: "heirloom",
    title: "Heirloom",
    world: "jewelry",
    parenthetical: "The Collection",
    description: "Gold, pearl, and champagne jewelry composed for close looking.",
    heroImage: {
      url: unsplash("1611591437281-460bfbe1220a", 1600),
      altText: "Dark jewel-box still life for KAYRA jewelry"
    }
  }
];

export const products: Product[] = seeds.map((seed) => ({
  id: `product-${seed.handle}`,
  handle: seed.handle,
  title: seed.title,
  world: seed.world,
  collectionHandle: seed.collectionHandle,
  description: seed.description,
  priceRange: {
    minVariantPrice: pkr(seed.price),
    maxVariantPrice: pkr(seed.price)
  },
  images: seed.images.map((url, index) => ({
    url,
    altText: `${seed.title} — KAYRA editorial, view ${index + 1}`
  })),
  variants: seed.sizes.map((size) => ({
    id: `variant-${seed.handle}-${size.toLowerCase().replaceAll(" ", "-")}`,
    title: size,
    availableForSale: true,
    price: pkr(seed.price),
    selectedOptions: { Size: size }
  }))
}));
