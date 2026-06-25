import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { shop } from "@/lib/shop";
import { themes } from "@/lib/theme";
import type { World } from "@/lib/shop/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { Media } from "@/components/site/Media";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export async function CollectionView({
  world,
  handle
}: {
  world: World;
  handle: string;
}) {
  const collection = await shop.getCollection(handle);

  if (!collection || collection.world !== world) {
    notFound();
  }

  const products = await shop.getProductsByCollection(handle);
  const t = themes[world];

  return (
    <div className={`min-h-screen ${t.page}`}>
      <SiteNav tone={world === "jewelry" ? "dark" : "light"} />

      <section className="relative flex h-[58vh] min-h-96 items-end overflow-hidden">
        <Media
          alt={collection.heroImage.altText}
          priority
          sizes="100vw"
          src={collection.heroImage.url}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.15)_30%,rgba(9,7,6,0.78))]"
        />
        <div className="relative z-10 w-full px-5 pb-12 text-[var(--kayra-ivory)] md:px-12">
          <Link
            className="mb-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[var(--kayra-ivory)]/80 transition hover:text-[var(--kayra-ivory)]"
            href={`/${world}`}
          >
            <ArrowLeft size={14} strokeWidth={1.4} />
            {world}
          </Link>
          <p className="mb-3 text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-gold)]">
            {collection.parenthetical}
          </p>
          <h1 className="font-display text-5xl uppercase tracking-[0.2em] md:text-7xl">
            {collection.title}
          </h1>
          <p className="mt-5 max-w-xl text-sm uppercase leading-7 tracking-[0.24em] text-[var(--kayra-ivory)]/80">
            {collection.description}
          </p>
        </div>
      </section>

      <main className="px-5 pb-24 md:px-12">
        <section className="pt-16">
          {products.length > 0 ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className={`py-20 text-center text-sm uppercase tracking-[0.3em] ${t.muted}`}>
              Pieces for this collection arrive soon.
            </p>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
