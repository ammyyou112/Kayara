"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/site/Media";
import type { HeroSlide } from "@/lib/shop/types";

const AUTO_MS = 5000;

export function StoreHero({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const select = useCallback(
    (next: number) => setIndex(((next % count) + count) % count),
    [count]
  );

  useEffect(() => {
    if (reduced || paused || count < 2) {
      return;
    }
    const timer = window.setTimeout(() => select(index + 1), AUTO_MS);
    return () => window.clearTimeout(timer);
  }, [index, reduced, paused, count, select]);

  if (!count) {
    return null;
  }

  return (
    <section
      aria-label="Featured campaigns"
      aria-roledescription="carousel"
      className="relative h-[62svh] min-h-[24rem] w-full overflow-hidden bg-[var(--kayra-walnut)] md:h-[78vh] md:min-h-[32rem]"
      onBlur={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            aria-hidden={!active}
            aria-roledescription="slide"
            className={`absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            key={slide.id}
          >
            {/* Inactive slides sit slightly zoomed and blurred so the active
                one "settles" into focus. Reduced motion: always sharp. */}
            <div
              className={`absolute inset-0 ${
                reduced
                  ? ""
                  : `transition-[filter,transform] duration-[1400ms] ease-out ${
                      active ? "scale-100 blur-0" : "scale-105 blur-[10px]"
                    }`
              }`}
            >
              <Media alt={slide.image.altText} priority={i === 0} sizes="100vw" src={slide.image.url} />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.05)_30%,rgba(9,7,6,0.75)),linear-gradient(90deg,rgba(9,7,6,0.45),transparent_65%)]"
            />

            <div className="absolute inset-x-0 bottom-0 pb-20 md:pb-24">
              <div className="w-full px-6 md:px-12">
                {slide.eyebrow ? (
                  <p
                    className={`mb-3 text-[10px] uppercase tracking-[0.34em] text-[var(--kayra-gold-light)] transition-all duration-700 md:text-[11px] md:tracking-[0.4em] ${
                      active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    }`}
                  >
                    {slide.eyebrow}
                  </p>
                ) : null}
                {slide.title ? (
                  <h2
                    className={`max-w-2xl font-display text-3xl uppercase leading-[1.05] tracking-[0.12em] text-[var(--kayra-ivory)] transition-all delay-100 duration-700 sm:text-4xl md:text-6xl ${
                      active ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    }`}
                  >
                    {slide.title}
                  </h2>
                ) : null}
                <Link
                  className={`magnetic-focus mt-6 inline-flex h-12 items-center gap-3 border border-[var(--kayra-ivory)]/60 px-6 text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-ivory)] transition duration-500 hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)] md:px-8 md:text-[11px] ${
                    active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
                  }`}
                  href={slide.href}
                  tabIndex={active ? 0 : -1}
                >
                  {slide.cta}
                  <ArrowUpRight size={14} strokeWidth={1.5} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Dot pagination with circular autoplay-progress ring */}
      {count > 1 ? (
        <div className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 md:bottom-7">
          {slides.map((slide, i) => {
            const active = i === index;
            return (
              <button
                aria-current={active}
                aria-label={`Go to slide ${i + 1}: ${slide.title}`}
                className="relative grid h-8 w-8 place-items-center"
                key={slide.id}
                onClick={() => select(i)}
                type="button"
              >
                {active && !reduced && !paused ? (
                  <svg
                    aria-hidden="true"
                    className="absolute inset-1 h-6 w-6 -rotate-90"
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
      ) : null}
    </section>
  );
}
