import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { shop } from "@/lib/shop";
import { collectionHref } from "@/lib/format";
import { unsplash } from "@/lib/images";
import type { Collection, Product } from "@/lib/shop/types";
import { Media } from "@/components/site/Media";
import { PinnedSection } from "@/components/site/PinnedSection";
import { StoreHero } from "@/components/home/StoreHero";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { MagazineShowcase } from "@/components/home/MagazineShowcase";
import { NewArrivals } from "@/components/home/NewArrivals";
import { InstagramGallery } from "@/components/home/InstagramGallery";

const statementImages = [unsplash("1483985988355-763728e1935b", 2200)];

const pickFeatured = (collections: Collection[], handles: string[]): Collection[] => {
  if (!handles.length) {
    return collections.slice(0, 6);
  }
  return handles
    .map((handle) => collections.find((collection) => collection.handle === handle))
    .filter((collection): collection is Collection => Boolean(collection));
};

export default async function Home() {
  const [slides, settings, collections, newest] = await Promise.all([
    shop.getHeroSlides(),
    shop.getSiteSettings(),
    shop.getCollections(),
    shop.getProducts({ sort: "newest" })
  ]);

  const featured = pickFeatured(collections, settings.featuredCollections);
  const trending: Product[] = settings.trendingCollection
    ? await shop.getProductsByCollection(settings.trendingCollection)
    : await shop.getProducts({ sort: "featured" });

  return (
    <>
      <h1 className="sr-only">KAYRA — Fashion &amp; Jewelry</h1>

      <StoreHero slides={slides} />

      {/* Featured collections — swipeable on mobile, grid on desktop */}
      {featured.length ? (
        <section className="py-16 md:px-8 md:py-24 xl:px-12">
          <div className="mb-7 flex items-end justify-between gap-4 px-5 md:mb-10 md:px-0">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--kayra-clay)]">
                The House of KAYRA
              </p>
              <h2 className="mt-2 font-display text-2xl uppercase leading-tight tracking-[0.1em] sm:text-3xl sm:tracking-[0.14em] md:text-5xl md:tracking-[0.18em]">
                Featured Collections
              </h2>
            </div>
            <Link
              className="magnetic-focus mb-1 inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-[10px] uppercase tracking-[0.26em] transition hover:opacity-60"
              href="/shop"
            >
              View all
              <ArrowUpRight size={14} strokeWidth={1.4} />
            </Link>
          </div>

          <div
            className={`no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:grid md:gap-6 md:overflow-visible md:px-0 ${
              featured.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"
            }`}
          >
            {featured.map((collection) => (
              <Link
                className="group relative flex aspect-[4/5] w-[74%] shrink-0 snap-start items-end overflow-hidden bg-[var(--kayra-ivory)] sm:w-[46%] md:w-auto"
                href={collectionHref(collection.world, collection.handle)}
                key={collection.id}
              >
                <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                  <Media
                    alt={collection.heroImage?.altText ?? collection.title}
                    sizes="(max-width: 768px) 74vw, 33vw"
                    src={collection.heroImage?.url ?? ""}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(9,7,6,0.8))]"
                />
                <div className="relative z-10 w-full p-5 text-[var(--kayra-ivory)] md:p-6">
                  {collection.parenthetical ? (
                    <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--kayra-gold-light)]">
                      {collection.parenthetical}
                    </p>
                  ) : null}
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <h3 className="font-display text-2xl uppercase leading-tight tracking-[0.14em] md:text-3xl">
                      {collection.title}
                    </h3>
                    <ArrowUpRight className="shrink-0" size={18} strokeWidth={1.4} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {trending.length ? (
        <ProductCarousel
          eyebrow="Most Wanted"
          products={trending.slice(0, 12)}
          title="Trending Now"
          viewAllHref="/shop"
        />
      ) : null}

      {newest.length ? <NewArrivals products={newest.slice(0, 8)} /> : null}

      <MagazineShowcase />

      <PinnedSection
        copy="A cinematic South Asian house of pret, bridal, and heirloom jewelry — shaped slowly and finished by hand."
        ctaHref="/about"
        ctaLabel="Discover the House"
        eyebrow="Est. Karachi"
        images={statementImages}
        title="We are KAYRA"
      />

      <InstagramGallery
        handle={settings.instagramHandle}
        images={settings.instagramImages}
        url={settings.instagramUrl}
      />
    </>
  );
}
