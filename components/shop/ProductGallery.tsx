"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Media } from "@/components/site/Media";
import { themes } from "@/lib/theme";
import type { Product } from "@/lib/shop/types";

export function ProductGallery({ product }: { product: Product }) {
  const images =
    product.images.length > 0 ? product.images : [{ url: "", altText: product.title }];
  const [active, setActive] = useState(0);
  const touchStart = useRef<number | null>(null);
  const t = themes[product.world];

  const go = (next: number) => setActive((next + images.length) % images.length);

  return (
    <div className="flex min-w-0 flex-col-reverse gap-3 md:flex-row md:gap-5">
      {/* Thumbnails */}
      {images.length > 1 ? (
        <div className="no-scrollbar flex gap-2 overflow-x-auto md:max-h-[70vh] md:flex-col md:gap-3 md:overflow-y-auto md:overflow-x-visible">
          {images.map((image, i) => (
            <button
              aria-current={i === active}
              aria-label={`View image ${i + 1}`}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border transition md:h-24 md:w-20 ${
                i === active ? "border-[var(--kayra-walnut)] opacity-100" : `${t.line} opacity-60 hover:opacity-100`
              }`}
              key={image.url + i}
              onClick={() => setActive(i)}
              type="button"
            >
              <Media alt="" sizes="80px" src={image.url} />
            </button>
          ))}
        </div>
      ) : null}

      {/* Main image (swipeable on touch screens) */}
      <div
        className={`group relative aspect-[4/5] min-w-0 flex-1 overflow-hidden border ${t.line} ${t.card}`}
        onTouchEnd={(event) => {
          if (touchStart.current === null) {
            return;
          }
          const delta = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(delta) > 40) {
            go(active + (delta < 0 ? 1 : -1));
          }
          touchStart.current = null;
        }}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
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
              className="magnetic-focus absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-[var(--kayra-ivory)]/80 text-[var(--kayra-walnut)] transition lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
              onClick={() => go(active - 1)}
              type="button"
            >
              <ChevronLeft size={18} strokeWidth={1.5} />
            </button>
            <button
              aria-label="Next image"
              className="magnetic-focus absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center bg-[var(--kayra-ivory)]/80 text-[var(--kayra-walnut)] transition lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
              onClick={() => go(active + 1)}
              type="button"
            >
              <ChevronRight size={18} strokeWidth={1.5} />
            </button>
            <div aria-hidden="true" className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
              {images.map((image, i) => (
                <span
                  className={`h-[3px] w-6 shadow-sm transition ${
                    i === active ? "bg-[var(--kayra-ivory)]" : "bg-[var(--kayra-ivory)]/45"
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
