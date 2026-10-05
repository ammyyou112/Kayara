"use client";

import { useMemo, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { themes } from "@/lib/theme";
import { formatMoney } from "@/lib/format";
import type { Product, ProductVariant } from "@/lib/shop/types";

const matches = (variant: ProductVariant, selection: Record<string, string>) =>
  Object.entries(selection).every(([name, value]) => variant.selectedOptions[name] === value);

export function AddToBag({ product }: { product: Product }) {
  const { addLine, error } = useCart();
  const t = themes[product.world];
  const initial =
    product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];

  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      product.options.map((option) => [
        option.name,
        initial?.selectedOptions[option.name] ?? option.values[0]
      ])
    )
  );
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");

  const selected = useMemo(
    () => product.variants.find((variant) => matches(variant, selection)) ?? null,
    [product.variants, selection]
  );

  // A value is selectable when some in-stock variant has it together with the
  // other currently selected options.
  const isAvailable = (optionName: string, value: string) =>
    product.variants.some(
      (variant) =>
        variant.availableForSale &&
        matches(variant, { ...selection, [optionName]: value })
    );

  const soldOut = !selected?.availableForSale;
  const price = selected?.price ?? product.priceRange.minVariantPrice;
  const compareAt = selected?.compareAtPrice;

  const handleAdd = async () => {
    if (!selected || soldOut || state === "adding") {
      return;
    }
    setState("adding");
    const ok = await addLine(selected.id);
    setState(ok ? "added" : "idle");
    if (ok) {
      window.setTimeout(() => setState("idle"), 1800);
    }
  };

  const label =
    state === "adding" ? (
      <>
        <Loader2 className="animate-spin" size={15} strokeWidth={1.6} />
        Adding
      </>
    ) : state === "added" ? (
      <>
        <Check size={15} strokeWidth={1.6} />
        Added to bag
      </>
    ) : soldOut ? (
      "Sold out"
    ) : (
      "Add to bag"
    );

  const selectionSummary = product.options
    .map((option) => selection[option.name])
    .filter(Boolean)
    .join(" / ");

  return (
    <div className="mt-8">
      {product.options.map((option) => (
        <fieldset className="mb-7" key={option.name}>
          <legend className={`mb-3 text-[10px] uppercase tracking-[0.32em] ${t.muted}`}>
            {option.name}
            {selection[option.name] ? (
              <span className="ml-2 text-[var(--kayra-walnut)]">— {selection[option.name]}</span>
            ) : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {option.values.map((value) => {
              const isSelected = selection[option.name] === value;
              const available = isAvailable(option.name, value);
              return (
                <button
                  aria-pressed={isSelected}
                  className={`magnetic-focus h-11 min-w-11 border px-4 text-[11px] uppercase tracking-[0.2em] transition ${
                    isSelected ? t.chipSelected : t.chip
                  } ${available ? "" : "line-through opacity-40"}`}
                  key={value}
                  onClick={() => setSelection((current) => ({ ...current, [option.name]: value }))}
                  type="button"
                >
                  {value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {error ? (
        <p className="mb-4 text-[11px] uppercase tracking-[0.2em] text-[var(--kayra-clay)]" role="alert">
          {error}
        </p>
      ) : null}

      {/* Inline button — desktop */}
      <button
        className={`magnetic-focus hidden h-14 min-w-64 items-center justify-center gap-3 px-8 text-[11px] uppercase tracking-[0.34em] transition duration-500 disabled:cursor-not-allowed disabled:opacity-50 lg:inline-flex ${t.solidBtn}`}
        disabled={soldOut || state === "adding"}
        onClick={handleAdd}
        type="button"
      >
        {label}
      </button>

      {/* Sticky bar — mobile/tablet, keeps the CTA reachable while scrolling */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-4 border-t border-[var(--kayra-walnut)]/15 bg-[var(--kayra-cream)]/95 px-5 pb-[calc(0.75rem_+_env(safe-area-inset-bottom))] pt-3 backdrop-blur-md lg:hidden"
        data-sticky-cta
      >
        <div className="min-w-0 shrink">
          <p className="truncate text-[9px] uppercase tracking-[0.2em] text-[var(--kayra-walnut)]/55">
            {selectionSummary || product.title}
          </p>
          <p className="whitespace-nowrap text-sm uppercase tracking-[0.12em]">
            {formatMoney(price)}
            {compareAt && compareAt.amount > price.amount ? (
              <span className="ml-2 text-[11px] text-[var(--kayra-walnut)]/45 line-through">
                {formatMoney(compareAt)}
              </span>
            ) : null}
          </p>
        </div>
        <button
          className={`magnetic-focus ml-auto inline-flex h-12 shrink-0 items-center justify-center gap-2 px-6 text-[11px] uppercase tracking-[0.26em] transition disabled:cursor-not-allowed disabled:opacity-50 sm:min-w-56 ${t.solidBtn}`}
          disabled={soldOut || state === "adding"}
          onClick={handleAdd}
          type="button"
        >
          {label}
        </button>
      </div>
    </div>
  );
}
