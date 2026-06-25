import Link from "next/link";
import type { Product } from "@/lib/shop/types";
import { formatMoney, productHref } from "@/lib/format";
import { themes } from "@/lib/theme";
import { Media } from "@/components/site/Media";

export function ProductCard({ product }: { product: Product }) {
  const t = themes[product.world];
  const image = product.images[0];

  return (
    <Link
      className="group block"
      href={productHref(product.world, product.handle)}
    >
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden border ${t.line} ${t.card}`}
      >
        <Media
          alt={image?.altText ?? product.title}
          className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          src={image?.url ?? ""}
        />
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="font-display text-lg uppercase tracking-[0.18em]">
          {product.title}
        </h3>
        <p className={`text-xs uppercase tracking-[0.22em] ${t.cardMuted}`}>
          {formatMoney(product.priceRange.minVariantPrice)}
        </p>
      </div>
    </Link>
  );
}
