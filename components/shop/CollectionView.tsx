import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { shop } from "@/lib/shop";
import { collectionHref } from "@/lib/format";
import { themes } from "@/lib/theme";
import type { World } from "@/lib/shop/types";
import { ProductCard } from "@/components/shop/ProductCard";
import { Media } from "@/components/site/Media";

export async function CollectionView({ world, handle }: { world: World; handle: string }) {
  const collection = await shop.getCollection(handle);

  if (!collection) {
    notFound();
  }
  if (collection.world !== world) {
    permanentRedirect(collectionHref(collection.world, collection.handle));
  }

  const products = await shop.getProductsByCollection(handle);
  const t = themes[world];
  const backHref = world === "jewelry" ? "/jewelry" : "/shop?world=clothing";

  return (
    <div className={t.page}>
      <section className="relative flex h-[46svh] min-h-80 items-end overflow-hidden bg-[var(--kayra-walnut)] md:h-[58vh] md:min-h-96">
        {collection.heroImage ? (
          <Media
            alt={collection.heroImage.altText}
            priority
            sizes="100vw"
            src={collection.heroImage.url}
          />
        ) : null}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.15)_30%,rgba(9,7,6,0.8))]"
        />
        <div className="relative z-10 w-full px-5 pb-10 text-[var(--kayra-ivory)] md:px-8 md:pb-12 xl:px-12">
          <Link
            className="mb-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-[var(--kayra-ivory)]/80 transition hover:text-[var(--kayra-ivory)]"
            href={backHref}
          >
            <ArrowLeft size={14} strokeWidth={1.4} />
            {world}
          </Link>
          {collection.parenthetical ? (
            <p className="mb-3 text-[11px] uppercase tracking-[0.4em] text-[var(--kayra-gold-light)]">
              {collection.parenthetical}
            </p>
          ) : null}
          <h1 className="font-display text-4xl uppercase leading-[1.05] tracking-[0.12em] sm:text-5xl md:text-7xl md:tracking-[0.18em]">
            {collection.title}
          </h1>
          {collection.description ? (
            <p className="mt-4 max-w-xl text-xs uppercase leading-6 tracking-[0.2em] text-[var(--kayra-ivory)]/80 md:mt-5 md:text-sm md:leading-7 md:tracking-[0.24em]">
              {collection.description}
            </p>
          ) : null}
        </div>
      </section>

      <main className="px-5 pb-24 md:px-8 xl:px-12">
        <section className="pt-10 md:pt-16">
          {products.length > 0 ? (
            <>
              <p className={`mb-8 text-[11px] uppercase tracking-[0.3em] ${t.cardMuted}`}>
                {products.length} {products.length === 1 ? "piece" : "pieces"}
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <p className={`py-20 text-center text-sm uppercase tracking-[0.3em] ${t.muted}`}>
              Pieces for this collection arrive soon.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
