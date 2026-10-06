"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useCart } from "@/components/cart/CartProvider";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { Media } from "@/components/site/Media";
import { ProductBadge, ProductCardMeta } from "@/components/shop/ProductCard";
import { themes } from "@/lib/theme";
import { productHref } from "@/lib/format";
import type { Product, ProductVariant, World } from "@/lib/shop/types";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const tabs: { key: "all" | World; label: string }[] = [
  { key: "all", label: "All" },
  { key: "clothing", label: "Clothing" },
  { key: "jewelry", label: "Jewelry" }
];

export function NewArrivals({
  products,
  showFilters = true,
  eyebrow = "Just In",
  title = "New Arrivals",
  ctaLabel = "View all arrivals",
  ctaHref = "/shop?sort=newest"
}: {
  products: Product[];
  showFilters?: boolean;
  eyebrow?: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [filter, setFilter] = useState<"all" | World>("all");
  const reduce = useReducedMotion();
  // Only offer the world tabs when both worlds actually have new pieces.
  const hasBothWorlds = new Set(products.map((product) => product.world)).size > 1;
  const filtersVisible = showFilters && hasBothWorlds;

  const filtered = useMemo(
    () =>
      !filtersVisible || filter === "all"
        ? products
        : products.filter((product) => product.world === filter),
    [filter, products, filtersVisible]
  );

  const grid: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };
  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
        exit: { opacity: 0 }
      };

  return (
    <section className="px-5 pb-20 pt-4 md:px-8 md:pb-24 xl:px-12">
      <div className="mb-9 flex flex-col gap-4 border-b border-[var(--kayra-walnut)]/15 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--kayra-clay)]">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-2xl uppercase leading-tight tracking-[0.1em] sm:text-3xl sm:tracking-[0.14em] md:text-5xl md:tracking-[0.18em]">
            {title}
          </h2>
        </div>

        <div className={`-mx-3 items-center ${filtersVisible ? "flex" : "hidden"}`} role="tablist">
          {tabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                aria-selected={active}
                className="relative px-3 py-2 text-[10px] uppercase tracking-[0.24em] transition"
                key={tab.key}
                role="tab"
                onClick={() => setFilter(tab.key)}
                type="button"
              >
                <span
                  className={
                    active
                      ? "text-[var(--kayra-walnut)]"
                      : "text-[var(--kayra-walnut)]/45 transition hover:text-[var(--kayra-walnut)]"
                  }
                >
                  {tab.label}
                </span>
                {active ? (
                  <motion.span
                    className="absolute inset-x-3 -bottom-px h-px bg-[var(--kayra-walnut)]"
                    layoutId="arrivals-underline"
                    transition={{ duration: 0.4, ease }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          animate="show"
          className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-4"
          exit="exit"
          initial="hidden"
          key={filter}
          variants={grid}
        >
          {filtered.map((product) => (
            <motion.div key={product.id} variants={item}>
              <ArrivalCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="mt-14 text-center">
        <Link
          className="magnetic-focus inline-flex items-center gap-3 border border-[var(--kayra-walnut)]/30 px-8 py-4 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
          href={ctaHref}
        >
          {ctaLabel}
          <ArrowUpRight size={15} strokeWidth={1.4} />
        </Link>
      </div>
    </section>
  );
}

function ArrivalCard({ product }: { product: Product }) {
  const { addLine } = useCart();
  const t = themes[product.world];
  const href = productHref(product.world, product.handle);
  const primary = product.images[0];
  const secondary = product.images[1];
  // Quick add works for single-option products; anything with several
  // options (size + colour …) sends the shopper to the product page.
  const quickOptions = product.options.length <= 1;
  const [state, setState] = useState<"idle" | "adding" | "added">("idle");

  const add = async (variant: ProductVariant) => {
    setState("adding");
    const ok = await addLine(variant.id);
    setState(ok ? "added" : "idle");
    if (ok) {
      window.setTimeout(() => setState("idle"), 1600);
    }
  };

  return (
    <div className="group relative">
      <div className={`relative aspect-[4/5] overflow-hidden border ${t.line} ${t.card}`}>
        <ProductBadge fallback="New" product={product} />
        <Link aria-label={product.title} className="absolute inset-0" href={href}>
          <span
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              secondary ? "group-hover:opacity-0" : ""
            }`}
          >
            <Media
              alt={primary?.altText ?? product.title}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              src={primary?.url ?? ""}
            />
          </span>
          {secondary ? (
            <span className="absolute inset-0 scale-105 opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100">
              <Media
                alt=""
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                src={secondary.url}
              />
            </span>
          ) : null}
        </Link>

        {/* Quick add (desktop hover / keyboard focus) */}
        {product.availableForSale ? (
          <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 hidden translate-y-3 opacity-0 transition-all duration-300 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block">
            <div className="flex flex-wrap items-center justify-center gap-1 border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-ivory)]/95 px-2 py-2 backdrop-blur-sm">
              {state === "added" ? (
                <span className="inline-flex items-center gap-1.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--kayra-walnut)]">
                  <Check size={13} strokeWidth={1.6} />
                  Added to bag
                </span>
              ) : !quickOptions ? (
                <Link
                  className="inline-flex items-center gap-2 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--kayra-walnut)] transition hover:opacity-60"
                  href={href}
                >
                  Choose options
                </Link>
              ) : product.variants.length > 1 ? (
                product.variants.map((variant) => (
                  <button
                    aria-label={`Add ${product.title}, ${variant.title}`}
                    className="h-7 min-w-7 px-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--kayra-walnut)] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)] disabled:cursor-not-allowed disabled:line-through disabled:opacity-30"
                    disabled={!variant.availableForSale || state === "adding"}
                    key={variant.id}
                    onClick={() => add(variant)}
                    type="button"
                  >
                    {variant.title}
                  </button>
                ))
              ) : (
                <button
                  className="inline-flex items-center gap-2 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--kayra-walnut)] transition hover:opacity-60"
                  disabled={state === "adding"}
                  onClick={() => add(product.variants[0])}
                  type="button"
                >
                  <Plus size={13} strokeWidth={1.6} />
                  {state === "adding" ? "Adding…" : "Add to bag"}
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>

      <WishlistButton className="absolute right-2 top-2 z-10" product={product} />

      <Link className="block" href={href}>
        <ProductCardMeta product={product} />
      </Link>
    </div>
  );
}
