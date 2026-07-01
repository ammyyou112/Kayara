import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { shop } from "@/lib/shop";
import { formatMoney, collectionHref } from "@/lib/format";
import { themes } from "@/lib/theme";
import type { World } from "@/lib/shop/types";
import { AddToBag } from "@/components/shop/AddToBag";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { ProductCarousel } from "@/components/home/ProductCarousel";

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
  const [related, allProducts] = await Promise.all([
    shop.getProductsByCollection(product.collectionHandle),
    shop.getProducts()
  ]);

  // Recommendations: collection-mates first, then the rest of the house.
  const recommendations = [
    ...related.filter((entry) => entry.id !== product.id),
    ...allProducts.filter(
      (entry) =>
        entry.id !== product.id &&
        entry.collectionHandle !== product.collectionHandle
    )
  ].slice(0, 8);

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
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className={`text-[11px] uppercase tracking-[0.45em] ${t.eyebrow}`}>
                  {collection?.title ?? world}
                </p>
                <h1 className="mt-4 font-display text-4xl uppercase leading-[0.95] tracking-[0.18em] md:text-6xl">
                  {product.title}
                </h1>
              </div>
              <WishlistButton className="mt-1 shrink-0" product={product} />
            </div>

            <p className="mt-6 text-lg uppercase tracking-[0.24em]">
              {formatMoney(product.priceRange.minVariantPrice)}
            </p>
            <p className={`mt-8 max-w-md text-sm leading-7 tracking-[0.04em] ${t.muted}`}>
              {product.description}
            </p>

            <AddToBag product={product} />
          </div>
        </section>

        {recommendations.length > 0 ? (
          <div className="mt-8">
            <ProductCarousel
              eyebrow="For you"
              products={recommendations}
              title="You may also like"
              viewAllHref="/shop"
            />
          </div>
        ) : null}
      </main>

      <SiteFooter />
    </div>
  );
}
