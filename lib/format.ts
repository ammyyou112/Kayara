import type { Money, World } from "./shop/types";

export function formatMoney(money: Money): string {
  const grouped = Math.round(money.amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `${money.currencyCode} ${grouped}`;
}

export function productHref(world: World, handle: string): string {
  return `/${world}/products/${handle}`;
}

export function collectionHref(world: World, handle: string): string {
  return `/${world}/collections/${handle}`;
}
