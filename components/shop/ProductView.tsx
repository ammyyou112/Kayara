import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { shop } from "@/lib/shop";
import { getBlock, paragraphs } from "@/lib/shop/blocks";
import { formatMoney, formatPriceRange, collectionHref, productHref } from "@/lib/format";
import { themes } from "@/lib/theme";
import type { World } from "@/lib/shop/types";
import { AddToBag } from "@/components/shop/AddToBag";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { compareAtFor } from "@/components/shop/ProductCard";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { ProductCarousel } from "@/components/home/ProductCarousel";

export async function ProductView({ world, handle }: { world: World; handle: string }) {
  const product = await shop.getProduct(handle);

  if (!product) {
    notFound();
  }
  // A product re-categorised in Shopify keeps working from old links.
  if (product.world !== world) {
    permanentRedirect(productHref(product.world, product.handle));
  }

  const t = themes[world];
  const [collection, recommendations, sizeGuide] = await Promise.all([
    product.collectionHandle ? shop.getCollection(product.collectionHandle) : null,
    shop.getRecommendations(product),
    getBlock("size-guide")
  ]);
  // The "size-guide" content block shows on any product with a Size option,
  // once it has text or a chart image in Shopify.
  const showSizeGuide =
    product.options.some((option) => /size/i.test(option.name)) &&
    Boolean(sizeGuide.body || sizeGuide.images.length);
  const backHref = collection
    ? collectionHref(collection.world, collection.handle)
    : world === "jewelry"
      ? "/jewelry"
      : "/shop?world=clothing";
  const backLabel = collection?.title ?? (world === "jewelry" ? "Jewelry" : "Clothing");
  const compareAt = compareAtFor(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((image) => image.url),
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      lowPrice: product.priceRange.minVariantPrice.amount,
      highPrice: product.priceRange.maxVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    }
  };

  return (
    <div className={t.page}>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        type="application/ld+json"
      />

      <main className="px-5 pb-16 md:px-8 xl:px-12">
        <Link
          className={`mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] transition hover:opacity-60 md:mt-8 ${t.muted}`}
          href={backHref}
        >
          <ArrowLeft size={14} strokeWidth={1.4} />
          {backLabel}
        </Link>

        <section className="grid gap-8 py-8 md:py-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery product={product} />

          <div className="lg:py-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className={`text-[11px] uppercase tracking-[0.4em] ${t.eyebrow}`}>{backLabel}</p>
                <h1 className="mt-4 font-display text-3xl uppercase leading-[1.05] tracking-[0.12em] sm:text-4xl md:text-5xl md:tracking-[0.16em] xl:text-6xl">
                  {product.title}
                </h1>
              </div>
              <WishlistButton className="mt-1 shrink-0" product={product} />
            </div>

            <p className="mt-6 text-lg uppercase tracking-[0.2em]">
              {formatPriceRange(product.priceRange)}
              {compareAt ? (
                <span className="ml-3 text-sm text-[var(--kayra-walnut)]/45 line-through">
                  {formatMoney(compareAt)}
                </span>
              ) : null}
            </p>

            <AddToBag product={product} />

            {showSizeGuide ? (
              <details className="group mt-8 max-w-lg border-y border-[var(--kayra-walnut)]/15">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-[11px] uppercase tracking-[0.3em] [&::-webkit-details-marker]:hidden">
                  {sizeGuide.title}
                  <span aria-hidden="true" className="text-base transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className={`pb-6 text-sm leading-7 ${t.muted}`}>
                  {paragraphs(sizeGuide.body).map((paragraph) => (
                    <p className="mb-3 whitespace-pre-line" key={paragraph}>
                      {paragraph}
                    </p>
                  ))}
                  {sizeGuide.images.map((image) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={image.altText}
                      className="mt-3 w-full"
                      key={image.url}
                      loading="lazy"
                      src={image.url}
                    />
                  ))}
                </div>
              </details>
            ) : null}

            {product.descriptionHtml ? (
              <div
                className={`rte mt-10 max-w-lg border-t border-[var(--kayra-walnut)]/15 pt-8 text-sm ${t.muted}`}
                // Authored by the merchant in Shopify admin.
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : product.description ? (
              <p className={`mt-10 max-w-lg border-t border-[var(--kayra-walnut)]/15 pt-8 text-sm leading-7 tracking-[0.03em] ${t.muted}`}>
                {product.description}
              </p>
            ) : null}
          </div>
        </section>
      </main>

      {recommendations.length > 0 ? (
        <ProductCarousel
          eyebrow="For you"
          products={recommendations}
          title="You may also like"
          viewAllHref={backHref}
        />
      ) : null}
    </div>
  );
}
