"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useCart } from "@/components/cart/CartProvider";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { Media } from "@/components/site/Media";
import { themes } from "@/lib/theme";
import { formatMoney, productHref } from "@/lib/format";
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
  title = "New Arrivals"
}: {
  products: Product[];
  showFilters?: boolean;
  eyebrow?: string;
  title?: string;
}) {
  const [filter, setFilter] = useState<"all" | World>("all");
  const reduce = useReducedMotion();

  const filtered = useMemo(
    () =>
      !showFilters || filter === "all"
        ? products
        : products.filter((product) => product.world === filter),
    [filter, products, showFilters]
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
    <section className="px-5 pb-24 md:px-12">
      <div className="mb-9 flex flex-col gap-5 border-b border-[var(--kayra-walnut)]/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.18em] md:text-5xl">
            {title}
          </h2>
        </div>

        <div className={`items-center gap-1 ${showFilters ? "flex" : "hidden"}`}>
          {tabs.map((tab) => {
            const active = filter === tab.key;
            return (
              <button
                className="relative px-3 py-2 text-[10px] uppercase tracking-[0.28em] transition"
                key={tab.key}
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
          href="/shop"
        >
          View all arrivals
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
  const sized = product.variants.length > 1;
  const [added, setAdded] = useState(false);

  const add = (variant: ProductVariant) => {
    addLine(product, variant);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="group">
      <div
        className={`relative aspect-[4/5] overflow-hidden border ${t.line} ${t.card}`}
      >
        <span className="pointer-events-none absolute left-2 top-2 z-10 bg-[var(--kayra-ivory)]/90 px-2 py-1 text-[8px] uppercase tracking-[0.28em] text-[var(--kayra-walnut)]">
          New
        </span>
        <WishlistButton
          className="absolute right-2 top-2 z-10"
          product={product}
        />
        <Link className="absolute inset-0" href={href}>
          <span
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              secondary ? "group-hover:opacity-0" : ""
            }`}
          >
            <Media
              alt={primary?.altText ?? product.title}
              sizes="(max-width: 1024px) 50vw, 33vw"
              src={primary?.url ?? ""}
            />
          </span>
          {secondary ? (
            <span className="absolute inset-0 scale-105 opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100">
              <Media
                alt=""
                sizes="(max-width: 1024px) 50vw, 33vw"
                src={secondary.url}
              />
            </span>
          ) : null}
        </Link>

        {/* Quick add (desktop hover) */}
        <div className="pointer-events-none absolute inset-x-2 bottom-2 z-10 hidden translate-y-3 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 lg:block">
          <div className="flex flex-wrap items-center justify-center gap-1 border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-ivory)]/92 px-2 py-2 backdrop-blur-sm">
            {added ? (
              <span className="inline-flex items-center gap-1.5 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--kayra-walnut)]">
                <Check size={13} strokeWidth={1.6} />
                Added to bag
              </span>
            ) : sized ? (
              product.variants.map((variant) => (
                <button
                  className="h-7 min-w-7 px-1.5 text-[10px] uppercase tracking-[0.12em] text-[var(--kayra-walnut)] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)] disabled:cursor-not-allowed disabled:opacity-30"
                  disabled={!variant.availableForSale}
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
                onClick={() => add(product.variants[0])}
                type="button"
              >
                <Plus size={13} strokeWidth={1.6} />
                Add to bag
              </button>
            )}
          </div>
        </div>
      </div>

      <Link
        className="mt-3 flex items-baseline justify-between gap-2"
        href={href}
      >
        <h3 className="font-display text-sm uppercase tracking-[0.14em] md:text-base">
          {product.title}
        </h3>
        <p className={`shrink-0 text-[10px] uppercase tracking-[0.16em] ${t.cardMuted}`}>
          {formatMoney(product.priceRange.minVariantPrice)}
        </p>
      </Link>
    </div>
  );
}
