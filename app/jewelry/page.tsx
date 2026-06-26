import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { shop } from "@/lib/shop";
import { formatMoney, productHref } from "@/lib/format";
import { jewel } from "@/lib/images";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Media } from "@/components/site/Media";

export const metadata: Metadata = {
  title: "Jewelry",
  description: "The KAYRA Jewelry Edit — heirloom gold, pearl, and champagne."
};

export default async function JewelryPage() {
  const products = await shop.getProducts("jewelry");
  const collection = await shop.getCollection("heirloom");
  const [lead, ...rest] = products;

  return (
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      {/* Magazine cover */}
      <section className="relative flex h-[78vh] min-h-[30rem] flex-col justify-between overflow-hidden md:h-[92vh] md:min-h-[36rem]">
        <Media alt="KAYRA Jewelry — the Edit" priority sizes="100vw" src={jewel.cover} />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.5),rgba(9,7,6,0.2)_45%,rgba(9,7,6,0.82))]"
        />

        <div className="relative z-10 flex items-center justify-between px-6 pt-24 text-[10px] uppercase tracking-[0.4em] text-[var(--kayra-ivory)]/80 md:px-12">
          <span>KAYRA Jewelry</span>
          <span>Issue 01 · Ceremony 2026</span>
        </div>

        <div className="relative z-10 px-6 pb-16 text-[var(--kayra-ivory)] md:px-12">
          <p className="mb-4 text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-gold)]">
            The Jewelry Edit
          </p>
          <h1 className="max-w-4xl font-display text-6xl uppercase leading-[0.86] tracking-[0.12em] sm:text-7xl md:text-[10rem]">
            Heirloom
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              className="magnetic-focus inline-flex h-14 items-center gap-3 border border-[var(--kayra-ivory)]/50 px-8 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)]"
              href="/jewelry/collections/heirloom"
            >
              Enter the Collection
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </Link>
            <span className="max-w-xs text-[10px] uppercase leading-6 tracking-[0.3em] text-[var(--kayra-ivory)]/70">
              Gold, pearl & champagne — composed for the closest looking.
            </span>
          </div>
        </div>
      </section>

      {/* Editorial opening */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-32">
        <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-clay)]">
          Editor&rsquo;s Letter
        </p>
        <p className="mt-8 font-display text-2xl leading-relaxed tracking-[0.04em] text-[var(--kayra-walnut)]/85 first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.7] first-letter:text-[var(--kayra-clay)] md:text-3xl">
          Jewelry is the most personal luxury — read slowly, at arm&rsquo;s length, in
          the warmth of an occasion. This edit gathers the pieces meant to be
          kept and passed on: a champagne glint at the ear, gold close at the
          throat, a single pearl held in a quiet band.
        </p>
      </section>

      {/* Feature spread 01 */}
      <section className="grid items-stretch gap-px border-y border-[var(--kayra-walnut)]/15 lg:grid-cols-12">
        <div className="relative min-h-[48vh] lg:col-span-7 lg:min-h-[60vh]">
          <Media alt="Champagne macro" sizes="(max-width: 1024px) 100vw, 58vw" src={jewel.macro} />
        </div>
        <div className="flex items-center px-8 py-16 lg:col-span-5 lg:px-14">
          <div className="max-w-md">
            <p className="font-display text-6xl text-[var(--kayra-clay)]/30">01</p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-tight tracking-[0.14em] md:text-5xl">
              The Champagne Story
            </h2>
            <p className="mt-6 text-sm uppercase leading-7 tracking-[0.22em] text-[var(--kayra-walnut)]/60">
              Warm gold and a restrained champagne tone, set for evening light.
              Worn one piece at a time, never a crowd.
            </p>
            <Link
              className="magnetic-focus mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-clay)] transition hover:opacity-70"
              href="/jewelry/collections/heirloom"
            >
              Read the chapter
              <ArrowUpRight size={15} strokeWidth={1.4} />
            </Link>
          </div>
        </div>
      </section>

      {/* The Edit — featured pieces */}
      <section className="px-6 py-16 md:px-12 md:py-24">
        <div className="mb-12 flex items-end justify-between border-b border-[var(--kayra-walnut)]/15 pb-5">
          <h2 className="font-display text-4xl uppercase tracking-[0.18em] md:text-5xl">
            The Edit
          </h2>
          <Link
            className="magnetic-focus hidden items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/60 transition hover:text-[var(--kayra-walnut)] sm:inline-flex"
            href="/shop?world=jewelry"
          >
            Shop all jewelry
            <ArrowUpRight size={15} strokeWidth={1.4} />
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {lead ? (
            <Link
              className="group lg:col-span-7"
              href={productHref("jewelry", lead.handle)}
            >
              <div className="relative aspect-[4/3] overflow-hidden border border-[var(--kayra-walnut)]/15">
                <Media
                  alt={lead.images[0]?.altText ?? lead.title}
                  className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  src={lead.images[0]?.url ?? ""}
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between">
                <h3 className="font-display text-2xl uppercase tracking-[0.16em]">
                  <span className="mr-3 text-[var(--kayra-clay)]/40">01</span>
                  {lead.title}
                </h3>
                <p className="text-xs uppercase tracking-[0.22em] text-[var(--kayra-walnut)]/55">
                  {formatMoney(lead.priceRange.minVariantPrice)}
                </p>
              </div>
            </Link>
          ) : null}

          <div className="flex flex-col gap-8 lg:col-span-5">
            {rest.map((product, i) => (
              <Link
                className="group flex gap-5"
                href={productHref("jewelry", product.handle)}
                key={product.id}
              >
                <div className="relative aspect-[3/4] w-32 shrink-0 overflow-hidden border border-[var(--kayra-walnut)]/15 sm:w-40">
                  <Media
                    alt={product.images[0]?.altText ?? product.title}
                    className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    sizes="160px"
                    src={product.images[0]?.url ?? ""}
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="font-display text-3xl text-[var(--kayra-clay)]/30">
                    {String(i + 2).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-xl uppercase tracking-[0.14em]">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[var(--kayra-walnut)]/55">
                    {formatMoney(product.priceRange.minVariantPrice)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-[var(--kayra-walnut)] px-6 py-20 text-center text-[var(--kayra-ivory)] md:py-36">
        <p className="mx-auto max-w-4xl font-display text-3xl uppercase leading-tight tracking-[0.08em] md:text-5xl">
          “The most personal luxury is the one you keep, and the one you pass on.”
        </p>
        <p className="mt-8 text-[11px] uppercase tracking-[0.4em] text-[var(--kayra-gold)]">
          — The House of KAYRA
        </p>
      </section>

      {/* Two-up spread */}
      <section className="grid gap-px md:grid-cols-2">
        {[
          { src: jewel.spread[0], caption: "Gold, close at the throat" },
          { src: jewel.spread[1], caption: "A single pearl, a quiet vow" }
        ].map((shot) => (
          <figure className="relative" key={shot.caption}>
            <div className="relative min-h-[44vh] md:min-h-[58vh]">
              <Media alt={shot.caption} sizes="(max-width: 768px) 100vw, 50vw" src={shot.src} />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgba(9,7,6,0.55))]"
              />
            </div>
            <figcaption className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.34em] text-[var(--kayra-ivory)]/85">
              {shot.caption}
            </figcaption>
          </figure>
        ))}
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-20 text-center md:py-36">
        <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-clay)]">
          {collection?.parenthetical ?? "The Collection"}
        </p>
        <h2 className="mt-5 font-display text-5xl uppercase tracking-[0.16em] md:text-7xl">
          Shop the Heirloom Edit
        </h2>
        <Link
          className="magnetic-focus mt-10 inline-flex h-14 items-center gap-3 border border-[var(--kayra-walnut)]/30 px-9 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
          href="/jewelry/collections/heirloom"
        >
          Enter the Collection
          <ArrowUpRight size={16} strokeWidth={1.4} />
        </Link>
      </section>

      <SiteFooter />
    </div>
  );
}
