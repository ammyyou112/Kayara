import type { Money, World } from "./shop/types";

export function formatMoney(money: Money): string {
  const whole = Number.isInteger(money.amount);
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: whole ? 0 : 2
  }).format(money.amount);

  return `${money.currencyCode} ${formatted}`;
}

/** "PKR 12,000" or "From PKR 12,000" when variants are priced differently. */
export function formatPriceRange(range: { minVariantPrice: Money; maxVariantPrice: Money }): string {
  const from = formatMoney(range.minVariantPrice);
  return range.maxVariantPrice.amount > range.minVariantPrice.amount ? `From ${from}` : from;
}

export function productHref(world: World, handle: string): string {
  return `/${world}/products/${handle}`;
}

export function collectionHref(world: World, handle: string): string {
  return `/${world}/collections/${handle}`;
}

/** Variant label for bag/checkout rows, e.g. "Size M / Ivory". */
export function variantLabel(variant: { title: string; selectedOptions: Record<string, string> }): string {
  const entries = Object.entries(variant.selectedOptions).filter(
    ([name, value]) => !(name === "Title" && value === "Default Title")
  );
  if (entries.length === 1 && entries[0][0] === "Size") {
    return `Size ${entries[0][1]}`;
  }
  return entries.map(([, value]) => value).join(" / ") || variant.title;
}
