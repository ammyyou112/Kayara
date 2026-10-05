"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Plus, X } from "lucide-react";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import { useCart } from "@/components/cart/CartProvider";
import { Media } from "@/components/site/Media";
import { ProductBadge, ProductCardMeta } from "@/components/shop/ProductCard";
import { productHref } from "@/lib/format";
import type { Product } from "@/lib/shop/types";

export default function WishlistPage() {
  const { items, ready, remove } = useWishlist();

  return (
    <>

      <main className="px-5 pb-24 md:px-8 xl:px-12">
        <header className="border-b border-[var(--kayra-walnut)]/15 py-12 text-center md:py-14">
          <h1 className="font-display text-4xl uppercase tracking-[0.2em] sm:text-5xl md:text-6xl">
            Wishlist
          </h1>
          {ready ? (
            <p className="mt-4 text-[11px] uppercase tracking-[0.34em] text-[var(--kayra-walnut)]/55">
              {items.length === 0
                ? "Empty"
                : `${items.length} ${items.length === 1 ? "piece" : "pieces"} saved`}
            </p>
          ) : null}
        </header>

        {!ready ? null : items.length === 0 ? (
          <section className="py-20 text-center">
            <p className="text-sm uppercase leading-7 tracking-[0.26em] text-[var(--kayra-walnut)]/60">
              You haven&rsquo;t saved anything yet.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                className="magnetic-focus inline-flex items-center border border-[var(--kayra-walnut)]/30 px-7 py-4 text-[11px] uppercase tracking-[0.32em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                href="/shop"
              >
                Explore the Maison
              </Link>
            </div>
          </section>
        ) : (
          <section className="grid grid-cols-2 gap-x-3 gap-y-10 py-12 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <WishlistCard key={product.id} onRemove={remove} product={product} />
            ))}
          </section>
        )}
      </main>
    </>
  );
}

function WishlistCard({
  product,
  onRemove
}: {
  product: Product;
  onRemove: (id: string) => void;
}) {
  const { addLine } = useCart();
  const href = productHref(product.world, product.handle);
  const variant =
    product.variants.find((entry) => entry.availableForSale) ?? product.variants[0];
  // Products with options (size, colour…) need a choice on the product page.
  const needsChoice = product.options.length > 0;
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");

  const add = async () => {
    if (!variant) {
      return;
    }
    setState("adding");
    const ok = await addLine(variant.id);
    setState(ok ? "added" : "idle");
    if (ok) {
      window.setTimeout(() => setState("idle"), 1600);
    }
  };

  const buttonClass =
    "magnetic-focus mt-3 inline-flex w-full items-center justify-center gap-2 border border-[var(--kayra-walnut)]/25 py-2.5 text-[10px] uppercase tracking-[0.22em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-ivory)]/45">
        <Link aria-label={product.title} className="absolute inset-0" href={href}>
          <Media
            alt={product.images[0]?.altText ?? product.title}
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            src={product.images[0]?.url ?? ""}
          />
        </Link>
        <ProductBadge product={product} />
        <button
          aria-label={`Remove ${product.title} from wishlist`}
          className="magnetic-focus absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-[var(--kayra-ivory)]/90 text-[var(--kayra-walnut)] backdrop-blur-sm transition hover:bg-[var(--kayra-ivory)]"
          onClick={() => onRemove(product.id)}
          type="button"
        >
          <X size={14} strokeWidth={1.6} />
        </button>
      </div>

      <Link className="block" href={href}>
        <ProductCardMeta product={product} />
      </Link>

      {!product.availableForSale ? (
        <button className={buttonClass} disabled type="button">
          Sold out
        </button>
      ) : needsChoice ? (
        <Link className={buttonClass} href={href}>
          Choose options
        </Link>
      ) : (
        <button className={buttonClass} disabled={state === "adding"} onClick={add} type="button">
          {state === "added" ? (
            <>
              <Check size={13} strokeWidth={1.6} />
              Added
            </>
          ) : (
            <>
              <Plus size={13} strokeWidth={1.6} />
              {state === "adding" ? "Adding…" : "Add to bag"}
            </>
          )}
        </button>
      )}
    </div>
  );
}
