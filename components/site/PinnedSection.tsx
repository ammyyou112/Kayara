"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// Desktop: a true fixed background (background-attachment: fixed) — the image
// stays still in the viewport while the content scrolls over it, like
// shop-june. Mobile: a small, static image (mobile browsers disable fixed
// backgrounds, and we want it compact there anyway). Auto-rotates as a slider.
export function PinnedSection({
  images,
  eyebrow,
  title,
  copy,
  ctaLabel,
  ctaHref
}: {
  images: string[];
  eyebrow: string;
  title: string;
  copy?: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length < 2) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = window.setInterval(
      () => setIndex((value) => (value + 1) % images.length),
      4500
    );
    return () => window.clearInterval(timer);
  }, [images.length]);

  return (
    <section className="relative flex min-h-[38svh] items-center justify-center overflow-hidden md:min-h-[92vh]">
      {images.map((src, i) => (
        <div
          aria-hidden="true"
          className={`absolute inset-0 bg-scroll bg-cover bg-center transition-opacity duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:bg-fixed ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          key={src}
          style={{ backgroundImage: `url("${src}")` }}
        />
      ))}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.45),rgba(9,7,6,0.62))]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12 text-center text-[var(--kayra-ivory)] md:py-20">
        <p className="mb-4 text-[10px] uppercase tracking-[0.5em] text-[var(--kayra-gold)] md:mb-5 md:text-[11px]">
          {eyebrow}
        </p>
        <h2 className="font-display text-3xl uppercase leading-[0.95] tracking-[0.14em] sm:text-4xl md:text-7xl">
          {title}
        </h2>
        {copy ? (
          <p className="mx-auto mt-5 max-w-xl text-xs uppercase leading-6 tracking-[0.24em] text-[var(--kayra-ivory)]/80 md:mt-6 md:text-sm md:leading-7">
            {copy}
          </p>
        ) : null}
        {ctaLabel && ctaHref ? (
          <Link
            className="magnetic-focus mt-7 inline-flex h-12 items-center gap-3 border border-[var(--kayra-ivory)]/50 px-7 text-[10px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)] md:mt-9 md:h-14 md:px-8 md:text-[11px]"
            href={ctaHref}
          >
            {ctaLabel}
            <ArrowUpRight size={15} strokeWidth={1.4} />
          </Link>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 md:bottom-6">
          {images.map((src, i) => (
            <span
              className={`h-[3px] transition-all duration-500 ${
                i === index
                  ? "w-8 bg-[var(--kayra-ivory)]"
                  : "w-4 bg-[var(--kayra-ivory)]/45"
              }`}
              key={`dot-${src}`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
