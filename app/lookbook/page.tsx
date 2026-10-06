import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getBlock, getBlockList } from "@/lib/shop/blocks";
import { Media } from "@/components/site/Media";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "The KAYRA lookbook — a cinematic editorial of pret and jewelry."
};

// Shopify → Metaobjects: the cover is "Lookbook page"; each chapter is an
// entry of "Lookbook — chapters", ordered by its Order field.
export default async function LookbookPage() {
  const [cover, chapters] = await Promise.all([
    getBlock("lookbook-cover"),
    getBlockList("lookbook-chapter")
  ]);
  const coverImage = cover.images[0];

  return (
    <>

      {/* Cover */}
      <section className="relative flex h-[64svh] min-h-[22rem] items-end overflow-hidden md:h-[90vh] md:min-h-[34rem]">
        <Media
          alt={coverImage?.altText ?? cover.title}
          priority
          sizes="100vw"
          src={coverImage?.url ?? ""}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.2)_30%,rgba(9,7,6,0.85))]"
        />
        <div className="relative z-10 px-6 pb-16 text-[var(--kayra-ivory)] md:px-12 md:pb-20">
          <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-[var(--kayra-gold-light)]">
            {cover.eyebrow}
          </p>
          <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-[0.12em] sm:text-6xl md:text-8xl xl:text-9xl">
            {cover.title}
          </h1>
        </div>
      </section>

      {/* Chapters */}
      {chapters.map((chapter, i) => {
        const image = chapter.images[0];
        const flip = i % 2 === 1;
        return (
          <section
            className={`grid items-stretch lg:grid-cols-2 ${
              flip ? "lg:[direction:rtl]" : ""
            }`}
            key={chapter.key}
          >
            <div className="relative min-h-[36svh] [direction:ltr] lg:min-h-[70vh]">
              <Media
                alt={image?.altText ?? chapter.title}
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={image?.url ?? ""}
              />
            </div>
            <div className="flex items-center px-6 py-14 [direction:ltr] md:px-12 md:py-20 xl:px-16">
              <div className="max-w-lg">
                <p className="font-display text-6xl tracking-[0.1em] text-[var(--kayra-clay)]/30 md:text-7xl">
                  {chapter.subtitle || String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-4 font-display text-3xl uppercase leading-tight tracking-[0.12em] sm:text-4xl md:text-5xl xl:text-6xl xl:tracking-[0.14em]">
                  {chapter.title}
                </h2>
                {chapter.body ? (
                  <p className="mt-6 text-sm uppercase leading-7 tracking-[0.24em] text-[var(--kayra-walnut)]/60">
                    {chapter.body}
                  </p>
                ) : null}
                {chapter.ctaLabel && chapter.ctaLink ? (
                  <Link
                    className="magnetic-focus mt-9 inline-flex h-14 items-center gap-3 border border-[var(--kayra-walnut)]/30 px-8 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                    href={chapter.ctaLink}
                  >
                    {chapter.ctaLabel}
                    <ArrowUpRight size={16} strokeWidth={1.4} />
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
