"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MotionConfig, motion, type Variants } from "motion/react";
import { Media } from "@/components/site/Media";
import type { ContentBlock } from "@/lib/shop/types";

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

// Text and images come from the "home-editorial", "home-editorial-story" and
// "home-editorial-quote" content blocks. Image captions are the images' alt text.
export function MagazineShowcase({
  header,
  story,
  quote: quoteText
}: {
  header: ContentBlock;
  story: ContentBlock;
  quote: string;
}) {
  const [lead, second] = story.images;

  // Server and client must render identical props (useReducedMotion is only
  // known on the client), so the reveal always runs; with reduced motion it
  // simply completes instantly via MotionConfig below.
  const reveal = (variants: Variants, amount = 0.3) => ({
    variants,
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once: true, amount }
  });

  return (
    <MotionConfig reducedMotion="user">
      <section className="bg-[var(--kayra-ivory)]/40 px-5 py-16 md:px-8 md:py-24 xl:px-12">
        <motion.div
          className="mb-10 flex items-end justify-between border-b border-[var(--kayra-walnut)]/15 pb-5"
          {...reveal(stagger, 0.6)}
        >
          <motion.div variants={fadeUp}>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
              {header.eyebrow}
            </p>
            <h2 className="mt-2 font-display text-2xl uppercase leading-tight tracking-[0.1em] sm:text-3xl sm:tracking-[0.14em] md:text-5xl md:tracking-[0.18em]">
              {header.title}
            </h2>
          </motion.div>
          {header.ctaLabel && header.ctaLink ? (
            <motion.div variants={fadeUp}>
              <Link
                className="magnetic-focus mb-1 inline-flex items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] transition hover:opacity-60"
                href={header.ctaLink}
              >
                {header.ctaLabel}
                <ArrowUpRight size={14} strokeWidth={1.4} />
              </Link>
            </motion.div>
          ) : null}
        </motion.div>

        {/* Asymmetric spread */}
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8">
          {lead ? (
          <motion.figure className="lg:col-span-7" {...reveal(stagger)}>
            <motion.div
              className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]"
              variants={imageClip}
            >
              <motion.div className="absolute inset-0" variants={imageZoom}>
                <Media
                  alt={lead.altText}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  src={lead.url}
                />
              </motion.div>
            </motion.div>
            <motion.figcaption
              className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)]/55"
              variants={fadeUp}
            >
              <span>01</span>
              <span className="h-px w-8 bg-[var(--kayra-walnut)]/30" />
              {lead.altText}
            </motion.figcaption>
          </motion.figure>
          ) : null}

          <div
            className={`flex flex-col justify-between gap-10 ${lead ? "lg:col-span-5" : "lg:col-span-12"}`}
          >
            <motion.div {...reveal(stagger, 0.4)}>
              <motion.p
                className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]"
                variants={fadeUp}
              >
                {story.eyebrow}
              </motion.p>
              <motion.h3
                className="mt-4 font-display text-3xl uppercase leading-tight tracking-[0.14em] md:text-4xl"
                variants={fadeUp}
              >
                {story.title}
              </motion.h3>
              <motion.p
                className="mt-6 text-sm uppercase leading-7 tracking-[0.22em] text-[var(--kayra-walnut)]/60"
                variants={fadeUp}
              >
                {story.body}
              </motion.p>
              {story.ctaLabel && story.ctaLink ? (
                <motion.div variants={fadeUp}>
                  <Link
                    className="magnetic-focus mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)] transition hover:opacity-60"
                    href={story.ctaLink}
                  >
                    {story.ctaLabel}
                    <ArrowUpRight size={15} strokeWidth={1.4} />
                  </Link>
                </motion.div>
              ) : null}
            </motion.div>

            {second ? (
            <motion.figure {...reveal(stagger)}>
              <motion.div
                className="relative aspect-[16/10] overflow-hidden"
                variants={imageClip}
              >
                <motion.div className="absolute inset-0" variants={imageZoom}>
                  <Media
                    alt={second.altText}
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    src={second.url}
                  />
                </motion.div>
              </motion.div>
              <motion.figcaption
                className="mt-3 flex items-center gap-3 text-[10px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)]/55"
                variants={fadeUp}
              >
                <span>02</span>
                <span className="h-px w-8 bg-[var(--kayra-walnut)]/30" />
                {second.altText}
              </motion.figcaption>
            </motion.figure>
            ) : null}
          </div>
        </div>

        {/* Pull quote */}
        {quoteText ? (
          <motion.blockquote
            className="mx-auto mt-16 max-w-3xl text-center font-display text-2xl uppercase leading-tight tracking-[0.06em] text-[var(--kayra-walnut)] md:mt-20 md:text-4xl"
            {...reveal(quote, 0.6)}
          >
            &ldquo;{quoteText}&rdquo;
          </motion.blockquote>
        ) : null}
      </section>
    </MotionConfig>
  );
}
