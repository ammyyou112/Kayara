"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { themes } from "@/lib/theme";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/lib/shop/types";

export function AddToBag({ product }: { product: Product }) {
  const { addLine } = useCart();
  const t = themes[product.world];
  const firstAvailable =
    product.variants.find((variant) => variant.availableForSale) ??
    product.variants[0];
  const [selectedId, setSelectedId] = useState(firstAvailable?.id ?? "");
  const [justAdded, setJustAdded] = useState(false);

  const selected =
    product.variants.find((variant) => variant.id === selectedId) ??
    firstAvailable;
  const isSizeChoice = product.variants.length > 1;

  const handleAdd = () => {
    if (!selected) {
      return;
    }
    addLine(product, selected);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const label = justAdded ? (
    <>
      <Check size={15} strokeWidth={1.6} />
      Added to bag
    </>
  ) : (
    "Add to bag"
  );

  return (
    <div className="mt-10">
      {isSizeChoice ? (
        <fieldset>
          <legend
            className={`mb-3 text-[10px] uppercase tracking-[0.32em] ${t.muted}`}
          >
            Size
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant) => {
              const isSelected = variant.id === selected?.id;
              return (
                <button
                  key={variant.id}
                  className={`magnetic-focus h-11 min-w-11 border px-4 text-[11px] uppercase tracking-[0.2em] transition ${
                    isSelected ? t.chipSelected : t.chip
                  } ${
                    variant.availableForSale
                      ? ""
                      : "cursor-not-allowed opacity-35"
                  }`}
                  disabled={!variant.availableForSale}
                  onClick={() => setSelectedId(variant.id)}
                  type="button"
                >
                  {variant.title}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {/* Inline button — desktop */}
      <button
        className={`magnetic-focus mt-8 hidden h-14 items-center justify-center gap-3 border px-8 text-[11px] uppercase tracking-[0.34em] transition duration-500 lg:inline-flex ${t.solidBtn}`}
        disabled={!selected?.availableForSale}
        onClick={handleAdd}
        type="button"
      >
        {label}
      </button>

      {/* Sticky bar — mobile, keeps the CTA reachable while scrolling */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-[var(--kayra-walnut)]/15 bg-[var(--kayra-cream)]/95 px-5 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden">
        <div className="shrink-0">
          <p className="text-[9px] uppercase tracking-[0.24em] text-[var(--kayra-walnut)]/55">
            {selected?.title ? `Size ${selected.title}` : "Price"}
          </p>
          <p className="text-sm uppercase tracking-[0.16em]">
            {formatMoney(selected?.price ?? product.priceRange.minVariantPrice)}
          </p>
        </div>
        <button
          className={`magnetic-focus inline-flex h-12 flex-1 items-center justify-center gap-2 px-6 text-[11px] uppercase tracking-[0.3em] transition ${t.solidBtn}`}
          disabled={!selected?.availableForSale}
          onClick={handleAdd}
          type="button"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
