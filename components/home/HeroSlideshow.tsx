"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Media } from "@/components/site/Media";
import { clothingHeroSlides, type HeroSlide } from "@/lib/images";

const AUTO_MS = 6000;

export function HeroSlideshow({
  slides = clothingHeroSlides
}: {
  slides?: HeroSlide[];
}) {
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const go = useCallback(
    (next: number) =>
      setIndex(((next % slides.length) + slides.length) % slides.length),
    [slides.length]
  );

  useEffect(() => {
    if (reduced) {
      return;
    }
    const timer = window.setInterval(() => go(index + 1), AUTO_MS);
    return () => window.clearInterval(timer);
  }, [index, reduced, go]);

  return (
    <section className="relative h-[62svh] min-h-[22rem] w-full overflow-hidden bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)] md:h-[88vh] md:min-h-[34rem]">
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            aria-hidden={!active}
            className={`absolute inset-0 transition-opacity duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              active ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            key={slide.id}
          >
            <div
              className={`absolute inset-0 transition-transform ease-out ${
                reduced ? "" : "duration-[7000ms]"
              } ${active && !reduced ? "scale-110" : "scale-100"}`}
            >
              <Media
                alt={slide.title}
                priority={i === 0}
                sizes="100vw"
                src={slide.image}
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.25)_20%,rgba(9,7,6,0.35)_55%,rgba(9,7,6,0.82))]"
            />
            <div className="absolute inset-0 flex items-end">
              <div className="w-full px-6 pb-20 md:px-12 md:pb-24 lg:px-16">
                <p
                  className={`mb-4 text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-gold)] transition-all duration-700 ${
                    active ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  }`}
                >
                  {slide.eyebrow}
                </p>
                <h1
                  className={`max-w-4xl font-display text-4xl uppercase leading-[0.95] tracking-[0.16em] transition-all delay-100 duration-700 sm:text-5xl md:text-8xl ${
                    active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {slide.title}
                </h1>
                <p
                  className={`mt-6 max-w-md text-sm uppercase leading-7 tracking-[0.24em] text-[var(--kayra-ivory)]/80 transition-all delay-200 duration-700 ${
                    active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {slide.copy}
                </p>
                <Link
                  className={`magnetic-focus mt-9 inline-flex h-14 items-center gap-3 border border-[var(--kayra-ivory)]/40 bg-[var(--kayra-ivory)]/10 px-8 text-[11px] uppercase tracking-[0.32em] backdrop-blur-sm transition duration-500 hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)] ${
                    active ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                  href={slide.href}
                >
                  {slide.ctaLabel}
                  <ArrowUpRight size={16} strokeWidth={1.4} />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Controls */}
      <div className="absolute bottom-8 right-6 z-10 flex items-center gap-3 md:right-12">
        <button
          aria-label="Previous slide"
          className="magnetic-focus grid h-11 w-11 place-items-center border border-[var(--kayra-ivory)]/40 transition hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)]"
          onClick={() => go(index - 1)}
          type="button"
        >
          <ArrowLeft size={16} strokeWidth={1.4} />
        </button>
        <button
          aria-label="Next slide"
          className="magnetic-focus grid h-11 w-11 place-items-center border border-[var(--kayra-ivory)]/40 transition hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)]"
          onClick={() => go(index + 1)}
          type="button"
        >
          <ArrowRight size={16} strokeWidth={1.4} />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-6 z-10 flex items-center gap-3 md:left-12">
        {slides.map((slide, i) => (
          <button
            aria-label={`Go to ${slide.title}`}
            className={`h-[2px] transition-all duration-500 ${
              i === index
                ? "w-10 bg-[var(--kayra-ivory)]"
                : "w-5 bg-[var(--kayra-ivory)]/40 hover:bg-[var(--kayra-ivory)]/70"
            }`}
            key={slide.id}
            onClick={() => setIndex(i)}
            type="button"
          />
        ))}
      </div>
    </section>
  );
}
