import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { editorial } from "@/lib/images";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Media } from "@/components/site/Media";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "The KAYRA lookbook — a cinematic editorial of pret and jewelry."
};

const chapters = [
  {
    index: "01",
    title: "Candlelight",
    copy: "Ivory drape and clay light, cut for the warm formal evening.",
    href: "/clothing/collections/luxe-pret"
  },
  {
    index: "02",
    title: "The Vow",
    copy: "Architectural bridal forms, softened by hand at every seam.",
    href: "/clothing/collections/bridal"
  },
  {
    index: "03",
    title: "Held Breath",
    copy: "Gold, pearl, and champagne composed for the closest looking.",
    href: "/jewelry/collections/heirloom"
  }
];

export default function LookbookPage() {
  const [first, ...rest] = editorial.lookbook;

  return (
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      {/* Cover */}
      <section className="relative flex h-[72vh] min-h-[28rem] items-end overflow-hidden md:h-[90vh] md:min-h-[34rem]">
        <Media alt="KAYRA lookbook" priority sizes="100vw" src={first} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.2)_30%,rgba(9,7,6,0.85))]"
        />
        <div className="relative z-10 px-6 pb-20 text-[var(--kayra-ivory)] md:px-12">
          <p className="mb-4 text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-gold)]">
            Lookbook — Ceremony 2026
          </p>
          <h1 className="font-display text-6xl uppercase leading-[0.9] tracking-[0.16em] md:text-9xl">
            The Edit
          </h1>
        </div>
      </section>

      {/* Chapters */}
      {chapters.map((chapter, i) => {
        const image = rest[i % rest.length];
        const flip = i % 2 === 1;
        return (
          <section
            className={`grid items-stretch lg:grid-cols-2 ${
              flip ? "lg:[direction:rtl]" : ""
            }`}
            key={chapter.index}
          >
            <div className="relative min-h-[48vh] [direction:ltr] lg:min-h-[70vh]">
              <Media
                alt={chapter.title}
                sizes="(max-width: 1024px) 100vw, 50vw"
                src={image}
              />
            </div>
            <div className="flex items-center px-8 py-14 [direction:ltr] md:px-16 md:py-20">
              <div className="max-w-md">
                <p className="font-display text-6xl tracking-[0.1em] text-[var(--kayra-clay)]/30 md:text-7xl">
                  {chapter.index}
                </p>
                <h2 className="mt-4 font-display text-4xl uppercase leading-tight tracking-[0.16em] md:text-6xl">
                  {chapter.title}
                </h2>
                <p className="mt-6 text-sm uppercase leading-7 tracking-[0.24em] text-[var(--kayra-walnut)]/60">
                  {chapter.copy}
                </p>
                <Link
                  className="magnetic-focus mt-9 inline-flex h-14 items-center gap-3 border border-[var(--kayra-walnut)]/30 px-8 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                  href={chapter.href}
                >
                  Shop the chapter
                  <ArrowUpRight size={16} strokeWidth={1.4} />
                </Link>
              </div>
            </div>
          </section>
        );
      })}

      <SiteFooter />
    </div>
  );
}
