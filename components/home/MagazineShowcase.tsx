"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { editorial } from "@/lib/images";
import { Media } from "@/components/site/Media";

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } }
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease } }
};

const imageClip: Variants = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  show: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.1, ease } }
};

const imageZoom: Variants = {
  hidden: { scale: 1.22 },
  show: { scale: 1, transition: { duration: 1.5, ease } }
};

const quote: Variants = {
  hidden: { opacity: 0, y: 24, letterSpacing: "0.26em" },
  show: {
    opacity: 1,
    y: 0,
    letterSpacing: "0.06em",
    transition: { duration: 1.1, ease }
  }
};

export function MagazineShowcase() {
  const reduce = useReducedMotion();

  // When reduced motion is requested, render everything in its resting state.
  const reveal = (variants: Variants, amount = 0.3) =>
    reduce
      ? { variants }
      : {
          variants,
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: true, amount }
        };

  return (
    <section className="bg-[var(--kayra-ivory)]/40 px-5 py-16 md:px-12 md:py-24">
      <motion.div
        className="mb-10 flex items-end justify-between border-b border-[var(--kayra-walnut)]/15 pb-5"
        {...reveal(stagger, 0.6)}
      >
        <motion.div variants={fadeUp}>
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
            The KAYRA Journal
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.18em] md:text-5xl">
            Editorial
          </h2>
        </motion.div>
        <motion.div variants={fadeUp}>
          <Link
            className="magnetic-focus mb-1 inline-flex items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] transition hover:opacity-60"
            href="/lookbook"
          >
            Issue 01
            <ArrowUpRight size={14} strokeWidth={1.4} />
          </Link>
        </motion.div>
      </motion.div>

      {/* Asymmetric spread */}
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
        <motion.figure className="lg:col-span-7" {...reveal(stagger)}>
          <motion.div
            className="relative aspect-[4/5] overflow-hidden sm:aspect-[16/11]"
            variants={imageClip}
          >
            <motion.div className="absolute inset-0" variants={imageZoom}>
              <Media
                alt="Candlelight editorial"
                sizes="(max-width: 1024px) 100vw, 58vw"
                src={editorial.lookbook[0]}
              />
            </motion.div>
          </motion.div>
          <motion.figcaption
            className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)]/55"
            variants={fadeUp}
          >
            <span>01</span>
            <span className="h-px w-8 bg-[var(--kayra-walnut)]/30" />
            Candlelight, clay &amp; gold
          </motion.figcaption>
        </motion.figure>

        <div className="flex flex-col justify-between gap-10 lg:col-span-5">
          <motion.div {...reveal(stagger, 0.4)}>
            <motion.p
              className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]"
              variants={fadeUp}
            >
              The Story
            </motion.p>
            <motion.h3
              className="mt-4 font-display text-3xl uppercase leading-tight tracking-[0.14em] md:text-4xl"
              variants={fadeUp}
            >
              A warm formal evening, in three acts
            </motion.h3>
            <motion.p
              className="mt-6 text-sm uppercase leading-7 tracking-[0.22em] text-[var(--kayra-walnut)]/60"
              variants={fadeUp}
            >
              From the first drape of ivory to the last champagne glint — a slow
              look at the pieces shaped for the occasion, and the hands behind
              them.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                className="magnetic-focus mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)] transition hover:opacity-60"
                href="/lookbook"
              >
                Read the lookbook
                <ArrowUpRight size={15} strokeWidth={1.4} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.figure {...reveal(stagger)}>
            <motion.div
              className="relative aspect-[16/10] overflow-hidden"
              variants={imageClip}
            >
              <motion.div className="absolute inset-0" variants={imageZoom}>
                <Media
                  alt="Atelier detail"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  src={editorial.lookbook[1]}
                />
              </motion.div>
            </motion.div>
            <motion.figcaption
              className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)]/55"
              variants={fadeUp}
            >
              <span>02</span>
              <span className="h-px w-8 bg-[var(--kayra-walnut)]/30" />
              Held breath, near-black velvet
            </motion.figcaption>
          </motion.figure>
        </div>
      </div>

      {/* Pull quote */}
      <motion.blockquote
        className="mx-auto mt-16 max-w-3xl text-center font-display text-2xl uppercase leading-tight tracking-[0.06em] text-[var(--kayra-walnut)] md:mt-20 md:text-4xl"
        {...reveal(quote, 0.6)}
      >
        &ldquo;Luxury is the quiet of a room that has been considered.&rdquo;
      </motion.blockquote>
    </section>
  );
}
