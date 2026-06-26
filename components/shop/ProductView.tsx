import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { shop } from "@/lib/shop";
import { formatMoney, collectionHref } from "@/lib/format";
import { themes } from "@/lib/theme";
import type { World } from "@/lib/shop/types";
import { AddToBag } from "@/components/shop/AddToBag";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

export async function ProductView({
  world,
  handle
}: {
  world: World;
  handle: string;
}) {
  const product = await shop.getProduct(handle);

  if (!product || product.world !== world) {
    notFound();
  }

  const t = themes[world];
  const collection = await shop.getCollection(product.collectionHandle);
  const related = (await shop.getProductsByCollection(product.collectionHandle))
    .filter((entry) => entry.id !== product.id)
    .slice(0, 3);

  return (
    <div className={`min-h-screen ${t.page}`}>
      <SiteNav tone="light" />

      <main className="px-5 pb-24 md:px-12">
        <Link
          className={`mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] transition hover:opacity-60 ${t.muted}`}
          href={collectionHref(world, product.collectionHandle)}
        >
          <ArrowLeft size={14} strokeWidth={1.4} />
          {collection?.title ?? world}
        </Link>

        <section className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />

          <div className="lg:py-6">
            <p className={`text-[11px] uppercase tracking-[0.45em] ${t.eyebrow}`}>
              {collection?.title ?? world}
            </p>
            <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-[0.18em] md:text-6xl">
              {product.title}
            </h1>
            <p className="mt-6 text-lg uppercase tracking-[0.24em]">
              {formatMoney(product.priceRange.minVariantPrice)}
            </p>
            <p className={`mt-8 max-w-md text-sm leading-7 tracking-[0.04em] ${t.muted}`}>
              {product.description}
            </p>

            <AddToBag product={product} />
          </div>
        </section>

        {related.length > 0 ? (
          <section aria-labelledby="related" className="mt-16">
            <div className={`mb-8 border-b pb-4 ${t.line}`}>
              <h2
                className="font-display text-2xl uppercase tracking-[0.22em]"
                id="related"
              >
                More from {collection?.title ?? "the collection"}
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
              {related.map((entry) => (
                <ProductCard key={entry.id} product={entry} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
