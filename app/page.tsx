import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { shop } from "@/lib/shop";
import { collectionHref } from "@/lib/format";
import { unsplash } from "@/lib/images";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Media } from "@/components/site/Media";
import { PinnedSection } from "@/components/site/PinnedSection";
import { StoreHero } from "@/components/home/StoreHero";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { MagazineShowcase } from "@/components/home/MagazineShowcase";
import { NewArrivals } from "@/components/home/NewArrivals";
import { InstagramGallery } from "@/components/home/InstagramGallery";

const statementImages = [unsplash("1483985988355-763728e1935b", 2200)];

export default async function Home() {
  const [collections, products] = await Promise.all([
    shop.getCollections(),
    shop.getProducts()
  ]);
  const trending = [...products].sort(
    (a, b) =>
      b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount
  );

  return (
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      <StoreHero />

      {/* Featured collections — swipeable on mobile, compact grid on desktop */}
      <section className="py-16 md:px-12 md:py-24">
        <div className="mb-7 flex items-end justify-between px-5 md:mb-10 md:px-0">
          <div>
            <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
              The House of KAYRA
            </p>
            <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.18em] md:text-5xl">
              Featured Collections
            </h2>
          </div>
          <Link
            className="magnetic-focus mb-1 inline-flex items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] transition hover:opacity-60"
            href="/shop"
          >
            View all
            <ArrowUpRight size={14} strokeWidth={1.4} />
          </Link>
        </div>

        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
          {collections.map((collection) => (
            <Link
              className="group relative flex aspect-[4/5] min-w-[74%] shrink-0 snap-start items-end overflow-hidden sm:min-w-[46%] md:min-w-0"
              href={collectionHref(collection.world, collection.handle)}
              key={collection.id}
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                <Media
                  alt={collection.heroImage.altText}
                  sizes="(max-width: 768px) 74vw, 33vw"
                  src={collection.heroImage.url}
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(9,7,6,0.8))]"
              />
              <div className="relative z-10 w-full p-5 text-[var(--kayra-ivory)] md:p-6">
                <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--kayra-gold)]">
                  {collection.parenthetical}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <h3 className="font-display text-2xl uppercase tracking-[0.16em] md:text-3xl">
                    {collection.title}
                  </h3>
                  <ArrowUpRight size={18} strokeWidth={1.4} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top trending — carousel slider */}
      <ProductCarousel
        eyebrow="Most Wanted"
        products={trending}
        title="Trending Now"
        viewAllHref="/shop?sort=price-desc"
      />

      {/* New arrivals — interactive: filter tabs, hover swap, quick add */}
      <NewArrivals products={products} />

      {/* Magazine editorial showcase */}
      <MagazineShowcase />

      {/* We are KAYRA — fixed statement */}
      <PinnedSection
        copy="A cinematic South Asian house of pret, bridal, and heirloom jewelry — shaped slowly and finished by hand."
        ctaHref="/about"
        ctaLabel="Discover the House"
        eyebrow="Est. Karachi"
        images={statementImages}
        title="We are KAYRA"
      />

      {/* Instagram / social gallery */}
      <InstagramGallery />

      <SiteFooter />
    </div>
  );
}
