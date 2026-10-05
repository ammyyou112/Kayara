// Curated, verified remote imagery (Unsplash). Centralised so the look can be
// swapped to licensed brand photography by editing one file.

export const unsplash = (id: string, w = 1600): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

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
