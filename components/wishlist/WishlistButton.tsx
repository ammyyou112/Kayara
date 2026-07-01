"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import type { Product } from "@/lib/shop/types";

export function WishlistButton({
  product,
  className = ""
}: {
  product: Product;
  className?: string;
}) {
  const { has, toggle, ready } = useWishlist();
  const active = ready && has(product.id);

  return (
    <button
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`magnetic-focus grid h-9 w-9 place-items-center rounded-full bg-[var(--kayra-ivory)]/90 text-[var(--kayra-walnut)] backdrop-blur-sm transition hover:bg-[var(--kayra-ivory)] ${className}`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(product);
      }}
      type="button"
    >
      <Heart
        className={active ? "text-[var(--kayra-clay)]" : ""}
        fill={active ? "currentColor" : "none"}
        size={16}
        strokeWidth={1.6}
      />
    </button>
  );
}
