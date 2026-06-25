"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Media } from "@/components/site/Media";
import { themes } from "@/lib/theme";
import type { Product } from "@/lib/shop/types";

export function ProductGallery({ product }: { product: Product }) {
  const images =
    product.images.length > 0
      ? product.images
      : [{ url: "", altText: product.title }];
  const [active, setActive] = useState(0);
  const t = themes[product.world];

  const go = (next: number) =>
    setActive((next + images.length) % images.length);

  return (
    <div className="flex flex-col-reverse gap-4 md:flex-row md:gap-5">
      {/* Thumbnails */}
      {images.length > 1 ? (
        <div className="flex gap-3 md:flex-col">
          {images.map((image, i) => (
            <button
              aria-label={`View ${i + 1}`}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border transition md:h-24 md:w-20 ${
                i === active
                  ? "border-current opacity-100"
                  : `${t.line} opacity-60 hover:opacity-100`
              }`}
              key={image.url + i}
              onClick={() => setActive(i)}
              type="button"
            >
              <Media alt={image.altText} sizes="80px" src={image.url} />
            </button>
          ))}
        </div>
      ) : null}

      {/* Main image */}
      <div
        className={`group relative aspect-[4/5] flex-1 overflow-hidden border ${t.line} ${t.card}`}
      >
        <Media
          alt={images[active].altText}
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          src={images[active].url}
        />

        {images.length > 1 ? (
          <>
            <button
              aria-label="Previous image"
              className="magnetic-focus absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center border border-current/30 bg-[var(--kayra-ivory)]/70 text-[var(--kayra-walnut)] opacity-0 transition group-hover:opacity-100"
              onClick={() => go(active - 1)}
              type="button"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Next image"
              className="magnetic-focus absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center border border-current/30 bg-[var(--kayra-ivory)]/70 text-[var(--kayra-walnut)] opacity-0 transition group-hover:opacity-100"
              onClick={() => go(active + 1)}
              type="button"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((image, i) => (
                <span
                  className={`h-[3px] w-6 transition ${
                    i === active
                      ? "bg-[var(--kayra-ivory)]"
                      : "bg-[var(--kayra-ivory)]/40"
                  }`}
                  key={`dot-${image.url}-${i}`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
