import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { shop } from "@/lib/shop";
import { collectionHref } from "@/lib/format";
import { editorial, jewel } from "@/lib/images";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Media } from "@/components/site/Media";
import { ProductCard } from "@/components/shop/ProductCard";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";

export const metadata: Metadata = {
  title: "Clothing",
  description: "Luxe pret, bridal, and wedding-guest wear from KAYRA."
};

const world = "clothing" as const;

export default async function ClothingPage() {
  const [collections, products] = await Promise.all([
    shop.getCollections(world),
    shop.getProducts(world)
  ]);
  const arrivals = products.slice(0, 6);

  return (
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      <HeroSlideshow />

      {/* Featured collections */}
      <section className="px-5 py-20 md:px-12 md:py-28">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-clay)]">
            The Clothing House
          </p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.2em] md:text-6xl">
            Collections
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {collections.map((collection) => (
            <Link
              className="group relative flex aspect-[16/11] items-end overflow-hidden"
              href={collectionHref(world, collection.handle)}
              key={collection.id}
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                <Media
                  alt={collection.heroImage.altText}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={collection.heroImage.url}
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(9,7,6,0.78))]"
              />
              <div className="relative z-10 w-full p-7 text-[var(--kayra-ivory)]">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--kayra-gold)]">
                  {collection.parenthetical}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <h3 className="font-display text-3xl uppercase tracking-[0.18em]">
                    {collection.title}
                  </h3>
                  <ArrowUpRight size={20} strokeWidth={1.4} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="px-5 py-8 md:px-12 md:pb-24">
        <div className="mb-10 flex items-end justify-between border-b border-[var(--kayra-walnut)]/15 pb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-clay)]">
              Just In
            </p>
            <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.2em] md:text-5xl">
              New Arrivals
            </h2>
          </div>
          <Link
            className="magnetic-focus hidden items-center gap-2 text-[11px] uppercase tracking-[0.3em] transition hover:opacity-60 sm:inline-flex"
            href="/shop?world=clothing"
          >
            View all
            <ArrowUpRight size={15} strokeWidth={1.4} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
          {arrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Editorial story band */}
      <section className="relative grid lg:grid-cols-2">
        <div className="relative min-h-[60vh]">
          <Media
            alt="Inside the KAYRA atelier"
            sizes="(max-width: 1024px) 100vw, 50vw"
            src={editorial.storyWide}
          />
        </div>
        <div className="flex items-center bg-[var(--kayra-walnut)] px-8 py-20 text-[var(--kayra-ivory)] md:px-16">
          <div className="max-w-md">
            <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-gold)]">
              The House
            </p>
            <h2 className="mt-5 font-display text-4xl uppercase leading-tight tracking-[0.16em] md:text-5xl">
              Made by hand, for the occasion
            </h2>
            <p className="mt-7 text-sm uppercase leading-7 tracking-[0.22em] text-[var(--kayra-ivory)]/70">
              Formal pret and bridal, shaped slowly and finished by hand for the
              warm occasions of South Asian life.
            </p>
            <Link
              className="magnetic-focus mt-10 inline-flex h-14 items-center gap-3 border border-[var(--kayra-ivory)]/40 px-8 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)]"
              href="/about"
            >
              Our Story
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </Link>
          </div>
        </div>
      </section>

      {/* Cross-link to jewelry */}
      <Link className="group relative flex min-h-[44vh] items-center justify-center overflow-hidden" href="/jewelry">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
          <Media alt="KAYRA Jewelry" sizes="100vw" src={jewel.cover} />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[rgba(9,7,6,0.6)]" />
        <div className="relative z-10 text-center text-[var(--kayra-ivory)]">
          <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--kayra-gold)]">
            The other world
          </p>
          <h2 className="mt-4 font-display text-5xl uppercase tracking-[0.18em] md:text-7xl">
            Jewelry
          </h2>
          <span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em]">
            Enter the Edit
            <ArrowUpRight size={15} strokeWidth={1.4} />
          </span>
        </div>
      </Link>

      <SiteFooter />
    </div>
  );
}
