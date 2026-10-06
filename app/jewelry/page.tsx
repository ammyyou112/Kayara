import Link from "next/link";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { shop } from "@/lib/shop";
import { collectionHref, formatPriceRange, productHref } from "@/lib/format";
import { unsplash } from "@/lib/images";
import { getBlockMap, paragraphs } from "@/lib/shop/blocks";
import { Media } from "@/components/site/Media";
import { PinnedSection } from "@/components/site/PinnedSection";

export const metadata: Metadata = {
  title: "Jewelry",
  description: "The KAYRA Jewelry Edit — heirloom gold, pearl, and champagne."
};

// Shown until there are at least two jewelry collections in the store.
const fallbackCategories = [
  { label: "Earrings", image: unsplash("1535632066927-ab7c9ab60908", 900) },
  { label: "Necklaces", image: unsplash("1605100804763-247f67b3557e", 900) },
  { label: "Rings", image: unsplash("1599643478518-a784e5dc4c8f", 900) },
  { label: "Bangles", image: unsplash("1515562141207-7a88fb7ce338", 900) }
].map((category) => ({ ...category, href: "/shop?world=jewelry" }));

export default async function JewelryPage() {
  const [products, collections, blocks] = await Promise.all([
    shop.getProducts({ world: "jewelry" }),
    shop.getCollections("jewelry"),
    getBlockMap([
      "jewelry-cover",
      "jewelry-letter",
      "jewelry-categories",
      "jewelry-slider",
      "jewelry-feature",
      "jewelry-edit",
      "jewelry-quote",
      "jewelry-statement",
      "jewelry-closing"
    ])
  ]);
  const {
    "jewelry-cover": cover,
    "jewelry-feature": feature,
    "jewelry-edit": edit,
    "jewelry-quote": quote,
    "jewelry-slider": slider,
    "jewelry-statement": statement,
    "jewelry-closing": closing
  } = blocks;
  // The cover story features the collection picked in the "jewelry-cover"
  // content block, otherwise the first jewelry collection.
  const collection =
    collections.find((entry) => entry.handle === cover.collection) ?? collections[0] ?? null;
  const collectionLink = collection
    ? collectionHref(collection.world, collection.handle)
    : "/shop?world=jewelry";
  const coverTitle = cover.title || collection?.title || "Jewelry";
  const coverImage = cover.images[0];
  const featureImage = feature.images[0];
  const categories =
    collections.length >= 2
      ? collections.slice(0, 8).map((entry) => ({
          label: entry.title,
          image: entry.heroImage?.url ?? "",
          href: collectionHref(entry.world, entry.handle)
        }))
      : fallbackCategories;
  const [lead, ...rest] = products;

  return (
    <>

      {/* Magazine cover */}
      <section className="relative flex h-[66svh] min-h-[24rem] flex-col justify-between overflow-hidden md:h-[92vh] md:min-h-[36rem]">
        <Media
          alt={coverImage?.altText ?? coverTitle}
          priority
          sizes="100vw"
          src={coverImage?.url ?? ""}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,6,0.5),rgba(9,7,6,0.2)_45%,rgba(9,7,6,0.82))]"
        />

        <div className="relative z-10 flex items-start justify-between gap-6 px-6 pt-10 text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-ivory)]/85 md:px-12 md:pt-16 md:tracking-[0.4em]">
          <span>KAYRA Jewelry</span>
          <span className="text-right">{cover.subtitle}</span>
        </div>

        <div className="relative z-10 px-6 pb-12 text-[var(--kayra-ivory)] md:px-12 md:pb-16">
          <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-[var(--kayra-gold-light)]">
            {cover.eyebrow}
          </p>
          <h1 className="font-display text-5xl uppercase leading-[0.9] tracking-[0.08em] sm:text-7xl md:text-8xl md:tracking-[0.12em] xl:text-[10rem]">
            {coverTitle}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <Link
              className="magnetic-focus inline-flex h-14 items-center gap-3 border border-[var(--kayra-ivory)]/50 px-8 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-ivory)] hover:text-[var(--kayra-walnut)]"
              href={cover.ctaLink || collectionLink}
            >
              {cover.ctaLabel}
              <ArrowUpRight size={16} strokeWidth={1.4} />
            </Link>
            {cover.body ? (
              <span className="max-w-xs text-[10px] uppercase leading-6 tracking-[0.3em] text-[var(--kayra-ivory)]/80">
                {cover.body}
              </span>
            ) : null}
          </div>
        </div>
      </section>

      {/* Editorial opening */}
      <section className="mx-auto max-w-4xl px-6 py-16 md:py-32">
        <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-clay)]">
          {blocks["jewelry-letter"].eyebrow}
        </p>
        {paragraphs(blocks["jewelry-letter"].body).map((paragraph, i) => (
          <p
            className={`mt-8 font-display text-2xl leading-relaxed tracking-[0.04em] text-[var(--kayra-walnut)]/85 md:text-3xl ${
              i === 0
                ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-7xl first-letter:leading-[0.7] first-letter:text-[var(--kayra-clay)]"
                : ""
            }`}
            key={paragraph}
          >
            {paragraph}
          </p>
        ))}
      </section>

      {/* Shop by category */}
      <section className="px-5 py-16 md:px-8 md:py-20 xl:px-12">
        <div className="mb-8 text-center md:mb-10">
          <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
            {blocks["jewelry-categories"].eyebrow}
          </p>
          <h2 className="mt-2 font-display text-3xl uppercase tracking-[0.18em] md:text-5xl">
            {blocks["jewelry-categories"].title}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              className="group relative flex aspect-[4/5] items-end overflow-hidden border border-[var(--kayra-walnut)]/15"
              href={category.href}
              key={category.label}
            >
              <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
                <Media
                  alt={category.label}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  src={category.image}
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(9,7,6,0.72))]"
              />
              <div className="relative z-10 w-full p-3 text-center text-[var(--kayra-ivory)] md:p-4">
                <h3 className="font-display text-base uppercase tracking-[0.1em] sm:text-lg sm:tracking-[0.16em] md:text-xl">
                  {category.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Fixed-background slider */}
      <PinnedSection
        copy={slider.body}
        ctaHref={slider.ctaLink}
        ctaLabel={slider.ctaLabel}
        eyebrow={slider.eyebrow}
        images={slider.images.map((image) => image.url)}
        title={slider.title}
      />

      {/* Feature spread 01 */}
      <section className="grid items-stretch gap-px border-y border-[var(--kayra-walnut)]/15 lg:grid-cols-12">
        <div className="relative min-h-[36svh] lg:col-span-7 lg:min-h-[60vh]">
          <Media
            alt={featureImage?.altText ?? feature.title}
            sizes="(max-width: 1024px) 100vw, 58vw"
            src={featureImage?.url ?? ""}
          />
        </div>
        <div className="flex items-center px-6 py-14 md:px-12 lg:col-span-5 lg:px-14 lg:py-16">
          <div className="max-w-md">
            {feature.subtitle ? (
              <p className="font-display text-6xl text-[var(--kayra-clay)]/30">{feature.subtitle}</p>
            ) : null}
            <h2 className="mt-4 font-display text-3xl uppercase leading-tight tracking-[0.12em] sm:text-4xl md:text-5xl md:tracking-[0.14em]">
              {feature.title}
            </h2>
            {feature.body ? (
              <p className="mt-6 text-sm uppercase leading-7 tracking-[0.22em] text-[var(--kayra-walnut)]/60">
                {feature.body}
              </p>
            ) : null}
            {feature.ctaLabel ? (
              <Link
                className="magnetic-focus mt-8 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-clay)] transition hover:opacity-70"
                href={feature.ctaLink || collectionLink}
              >
                {feature.ctaLabel}
                <ArrowUpRight size={15} strokeWidth={1.4} />
              </Link>
            ) : null}
          </div>
        </div>
      </section>

      {/* The Edit — featured pieces */}
      {lead ? (
      <section className="px-5 py-16 md:px-8 md:py-24 xl:px-12">
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-[var(--kayra-walnut)]/15 pb-5">
          <h2 className="font-display text-4xl uppercase tracking-[0.18em] md:text-5xl">
            {edit.title}
          </h2>
          <Link
            className="magnetic-focus inline-flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[var(--kayra-walnut)]/70 transition hover:text-[var(--kayra-walnut)] sm:text-[11px] sm:tracking-[0.3em]"
            href={edit.ctaLink || "/shop?world=jewelry"}
          >
            {edit.ctaLabel}
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
              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <h3 className="font-display text-xl uppercase leading-snug tracking-[0.12em] sm:text-2xl sm:tracking-[0.16em]">
                  <span className="mr-3 text-[var(--kayra-clay)]/50">01</span>
                  {lead.title}
                </h3>
                <p className="shrink-0 text-xs uppercase tracking-[0.2em] text-[var(--kayra-walnut)]/60">
                  {formatPriceRange(lead.priceRange)}
                </p>
              </div>
            </Link>
          ) : null}

          <div className="flex flex-col gap-8 lg:col-span-5">
            {rest.slice(0, 4).map((product, i) => (
              <Link
                className="group flex gap-5"
                href={productHref("jewelry", product.handle)}
                key={product.id}
              >
                <div className="relative aspect-[3/4] w-28 shrink-0 overflow-hidden border border-[var(--kayra-walnut)]/15 sm:w-40">
                  <Media
                    alt={product.images[0]?.altText ?? product.title}
                    className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                    sizes="160px"
                    src={product.images[0]?.url ?? ""}
                  />
                </div>
                <div className="flex min-w-0 flex-col justify-center">
                  <p className="font-display text-3xl text-[var(--kayra-clay)]/30">
                    {String(i + 2).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-lg uppercase leading-snug tracking-[0.12em] sm:text-xl sm:tracking-[0.14em]">
                    {product.title}
                  </h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-[var(--kayra-walnut)]/55">
                    {formatPriceRange(product.priceRange)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {/* Pull quote */}
      {quote.title ? (
        <section className="bg-[var(--kayra-walnut)] px-6 py-20 text-center text-[var(--kayra-ivory)] md:py-36">
          <p className="mx-auto max-w-4xl font-display text-2xl uppercase leading-tight tracking-[0.06em] sm:text-3xl md:text-5xl md:tracking-[0.08em]">
            “{quote.title}”
          </p>
          {quote.subtitle ? (
            <p className="mt-8 text-[11px] uppercase tracking-[0.4em] text-[var(--kayra-gold-light)]">
              {quote.subtitle}
            </p>
          ) : null}
        </section>
      ) : null}

      {/* We are KAYRA — fixed statement */}
      <PinnedSection
        copy={statement.body}
        ctaHref={statement.ctaLink}
        ctaLabel={statement.ctaLabel}
        eyebrow={statement.eyebrow}
        images={statement.images.map((image) => image.url)}
        title={statement.title}
      />

      {/* Closing CTA */}
      <section className="px-5 py-20 text-center md:py-32">
        <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-clay)]">
          {closing.eyebrow || collection?.parenthetical || "The Collection"}
        </p>
        <h2 className="mx-auto mt-5 max-w-4xl font-display text-4xl uppercase leading-tight tracking-[0.12em] sm:text-5xl md:text-7xl md:tracking-[0.16em]">
          {closing.title || `Shop the ${coverTitle} Edit`}
        </h2>
        <Link
          className="magnetic-focus mt-10 inline-flex h-14 items-center gap-3 border border-[var(--kayra-walnut)]/30 px-9 text-[11px] uppercase tracking-[0.32em] transition duration-500 hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
          href={closing.ctaLink || collectionLink}
        >
          {closing.ctaLabel}
          <ArrowUpRight size={16} strokeWidth={1.4} />
        </Link>
      </section>
    </>
  );
}
