"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { themes } from "@/lib/theme";
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

      <button
        className={`magnetic-focus mt-8 inline-flex h-14 w-full items-center justify-center gap-3 border px-8 text-[11px] uppercase tracking-[0.34em] transition duration-500 sm:w-auto ${t.solidBtn}`}
        disabled={!selected?.availableForSale}
        onClick={handleAdd}
        type="button"
      >
        {justAdded ? (
          <>
            <Check size={15} strokeWidth={1.6} />
            Added to bag
          </>
        ) : (
          "Add to bag"
        )}
      </button>
    </div>
  );
}
