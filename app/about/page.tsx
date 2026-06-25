import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { editorial } from "@/lib/images";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Media } from "@/components/site/Media";

export const metadata: Metadata = {
  title: "About",
  description:
    "KAYRA is a cinematic South Asian luxury house of formal pret, bridal, and heirloom jewelry."
};

const values = [
  {
    heading: "Hand-finished",
    body: "Every piece is shaped slowly and finished by hand in our ateliers."
  },
  {
    heading: "Considered materials",
    body: "Silk, fine gold, and pearl, chosen for how they hold light up close."
  },
  {
    heading: "Made for the occasion",
    body: "Formal pret, bridal, and jewelry composed for the moments that matter."
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      {/* Hero */}
      <section className="relative flex h-[70vh] min-h-[28rem] items-end overflow-hidden">
        <Media
          alt="The KAYRA house"
          priority
          sizes="100vw"
          src={editorial.storyPortrait}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.15)_30%,rgba(9,7,6,0.78))]"
        />
        <div className="relative z-10 px-6 pb-16 text-[var(--kayra-ivory)] md:px-12">
          <p className="mb-4 text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-gold)]">
            The House
          </p>
          <h1 className="max-w-3xl font-display text-5xl uppercase leading-[0.95] tracking-[0.16em] md:text-7xl">
            A cinematic luxury house
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <p className="text-base uppercase leading-9 tracking-[0.18em] text-[var(--kayra-walnut)]/80 md:text-lg">
          KAYRA was founded to dress the warm, formal occasions of South Asian
          life — the wedding guest, the bride, the heirloom passed between hands.
          We work between two worlds: warm editorial pret and a dark jewel-box of
          gold, pearl, and champagne.
        </p>
      </section>

      {/* Values */}
      <section className="border-y border-[var(--kayra-walnut)]/15 px-6 py-16 md:px-12">
        <div className="grid gap-12 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.heading}>
              <h2 className="font-display text-2xl uppercase tracking-[0.18em]">
                {value.heading}
              </h2>
              <p className="mt-4 text-sm uppercase leading-7 tracking-[0.22em] text-[var(--kayra-walnut)]/60">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Atelier split */}
      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[60vh]">
          <Media
            alt="Inside the atelier"
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={editorial.atelier}
          />
        </div>
        <div className="flex items-center bg-[var(--kayra-walnut)] px-8 py-20 text-[var(--kayra-ivory)] md:px-16">
          <div className="max-w-md">
            <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-gold)]">
              The Atelier
            </p>
            <h2 className="mt-5 font-display text-4xl uppercase leading-tight tracking-[0.16em] md:text-5xl">
              Slow craft, close looking
            </h2>
            <p className="mt-7 text-sm uppercase leading-7 tracking-[0.22em] text-[var(--kayra-ivory)]/70">
              Our pieces are built to be seen from arm&rsquo;s length — the fall of a
              hem, the set of a stone. Client care is personal; reach us for
              sizing, bespoke, and delivery.
            </p>
            <Link
              className="magnetic-focus mt-10 inline-flex h-14 items-center gap-3 border border-[var(--kayra-ivory)]/40 px-8 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)]"
              href="/shop"
            >
              Explore the Maison
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
