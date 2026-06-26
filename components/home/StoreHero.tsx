"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Media } from "@/components/site/Media";
import { storeHeroSlides } from "@/lib/images";

const AUTO_MS = 5000;

export function StoreHero() {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const count = storeHeroSlides.length;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const select = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (reduced) {
      return;
    }
    const timer = window.setTimeout(() => select(index + 1), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [index, reduced, select]);

  return (
    <section className="relative h-[70vh] min-h-[26rem] w-full overflow-hidden bg-[var(--kayra-walnut)] md:h-[76vh] md:min-h-[32rem]">
      {storeHeroSlides.map((slide, i) => {
        const active = i === index;
        return (
          <Link
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            href={slide.href}
            key={slide.id}
            tabIndex={active ? 0 : -1}
          >
            <div
              className={`absolute inset-0 transition-[filter,transform] ease-out ${
                reduced ? "" : "duration-[1400ms]"
              } ${active && !reduced ? "scale-100 blur-0" : "scale-105 blur-[10px]"}`}
            >
              <Media alt={slide.alt} priority={i === 0} sizes="100vw" src={slide.image} />
            </div>
          </Link>
        );
      })}

      {/* Dot pagination with circular autoplay-progress ring */}
      <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3.5">
        {storeHeroSlides.map((slide, i) => {
          const active = i === index;
          return (
            <button
              aria-label={`Go to slide ${i + 1}`}
              className="relative grid h-6 w-6 place-items-center"
              key={slide.id}
              onClick={() => select(i)}
              type="button"
            >
              {active && !reduced ? (
                <svg
                  className="absolute inset-0 h-6 w-6 -rotate-90"
                  fill="none"
                  key={index}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
                  <circle
                    className="kayra-dot-progress"
                    cx="12"
                    cy="12"
                    pathLength="1"
                    r="9"
                    stroke="#ffffff"
                    strokeDasharray="1"
                    strokeLinecap="round"
                    strokeWidth="1.5"
                    style={{ animationDuration: `${AUTO_MS}ms` }}
                  />
                </svg>
              ) : null}
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  active ? "bg-white" : "bg-white/45 hover:bg-white/80"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}
