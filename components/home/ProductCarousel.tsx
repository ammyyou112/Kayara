"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import type { Product } from "@/lib/shop/types";

export function ProductCarousel({
  products,
  eyebrow,
  title,
  viewAllHref = "/shop"
}: {
  products: Product[];
  eyebrow: string;
  title: string;
  viewAllHref?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: number) => {
    const track = trackRef.current;
    if (!track) {
      return;
    }
    track.scrollBy({ left: direction * track.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="py-12 md:px-12 md:py-16">
      <div className="mb-7 flex items-end justify-between px-5 md:mb-9 md:px-0">
        <div>
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.18em] md:text-5xl">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            className="magnetic-focus mb-1 hidden items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] transition hover:opacity-60 sm:inline-flex"
            href={viewAllHref}
          >
            View all
            <ArrowUpRight size={14} strokeWidth={1.4} />
          </Link>
          <div className="hidden items-center gap-2 md:flex">
            <button
              aria-label="Scroll left"
              className="magnetic-focus grid h-10 w-10 place-items-center border border-[var(--kayra-walnut)]/25 transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
              onClick={() => scroll(-1)}
              type="button"
            >
              <ChevronLeft size={17} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Scroll right"
              className="magnetic-focus grid h-10 w-10 place-items-center border border-[var(--kayra-walnut)]/25 transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
              onClick={() => scroll(1)}
              type="button"
            >
              <ChevronRight size={17} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 md:gap-5 md:px-0"
        ref={trackRef}
      >
        {products.map((product) => (
          <div
            className="w-[44%] shrink-0 snap-start sm:w-[30%] md:w-[23%] lg:w-[19%]"
            key={product.id}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
