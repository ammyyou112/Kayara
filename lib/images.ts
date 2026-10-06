// Unsplash helper for the built-in demo and fallback imagery. Real imagery is
// managed in Shopify (products, collections, content blocks, hero slides).

export const unsplash = (id: string, w = 1600): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
