import Link from "next/link";
import type { Product } from "@/lib/shop/types";
import { formatMoney, formatPriceRange, productHref } from "@/lib/format";
import { themes } from "@/lib/theme";
import { Media } from "@/components/site/Media";
import { WishlistButton } from "@/components/wishlist/WishlistButton";

/** Sale price comparison for the cheapest variant, if it is discounted. */
export function compareAtFor(product: Product) {
  const cheapest = product.variants.reduce<Product["variants"][number] | null>(
    (best, variant) => (!best || variant.price.amount < best.price.amount ? variant : best),
    null
  );
  return cheapest?.compareAtPrice && cheapest.compareAtPrice.amount > cheapest.price.amount
    ? cheapest.compareAtPrice
    : null;
}

export function ProductBadge({ product, fallback }: { product: Product; fallback?: string }) {
  const label = !product.availableForSale
    ? "Sold out"
    : compareAtFor(product)
      ? "Sale"
      : (product.badge ?? fallback);
  return label ? (
    <span className="pointer-events-none absolute left-2 top-2 z-10 bg-[var(--kayra-ivory)]/90 px-2 py-1 text-[8px] uppercase tracking-[0.28em] text-[var(--kayra-walnut)]">
      {label}
    </span>
  ) : null;
}

export function ProductCardMeta({ product }: { product: Product }) {
  const t = themes[product.world];
  const compareAt = compareAtFor(product);
  return (
    <div className="mt-3 md:mt-4">
      <h3 className="font-display text-[15px] uppercase leading-snug tracking-[0.12em] md:text-lg md:tracking-[0.16em]">
        {product.title}
      </h3>
      <p className={`mt-1 text-[10px] uppercase tracking-[0.16em] md:text-xs md:tracking-[0.2em] ${t.cardMuted}`}>
        {formatPriceRange(product.priceRange)}
        {compareAt ? (
          <span className="ml-2 line-through opacity-60">{formatMoney(compareAt)}</span>
        ) : null}
      </p>
    </div>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const t = themes[product.world];
  const image = product.images[0];

  return (
    <div className="group relative">
      <Link className="block" href={productHref(product.world, product.handle)}>
        <div className={`relative aspect-[4/5] w-full overflow-hidden border ${t.line} ${t.card}`}>
          <Media
            alt={image?.altText ?? product.title}
            className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={image?.url ?? ""}
          />
          <ProductBadge product={product} />
        </div>
        <ProductCardMeta product={product} />
      </Link>
      {/* Kept outside the link so the button isn't nested inside an <a>. */}
      <WishlistButton
        className="absolute right-2 top-2 z-10 opacity-100 transition lg:opacity-0 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100"
        product={product}
      />
    </div>
  );
}
