import Link from "next/link";
import type { Metadata } from "next";
import { shop } from "@/lib/shop";
import type { Product, World } from "@/lib/shop/types";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse all KAYRA clothing and jewelry."
};

type Sort = "featured" | "price-asc" | "price-desc";

const worldFilters: { label: string; value: "all" | World }[] = [
  { label: "All", value: "all" },
  { label: "Clothing", value: "clothing" },
  { label: "Jewelry", value: "jewelry" }
];

const sortOptions: { label: string; value: Sort }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" }
];

const sortProducts = (items: Product[], sort: Sort): Product[] => {
  if (sort === "price-asc") {
    return [...items].sort(
      (a, b) =>
        a.priceRange.minVariantPrice.amount - b.priceRange.minVariantPrice.amount
    );
  }
  if (sort === "price-desc") {
    return [...items].sort(
      (a, b) =>
        b.priceRange.minVariantPrice.amount - a.priceRange.minVariantPrice.amount
    );
  }
  return items;
};

const link = (world: string, sort: string) => {
  const params = new URLSearchParams();
  if (world !== "all") {
    params.set("world", world);
  }
  if (sort !== "featured") {
    params.set("sort", sort);
  }
  const query = params.toString();
  return query ? `/shop?${query}` : "/shop";
};

export default async function ShopPage({
  searchParams
}: {
  searchParams: Promise<{ world?: string; sort?: string }>;
}) {
  const { world: worldParam, sort: sortParam } = await searchParams;
  const world: "all" | World =
    worldParam === "clothing" || worldParam === "jewelry" ? worldParam : "all";
  const sort: Sort =
    sortParam === "price-asc" || sortParam === "price-desc"
      ? sortParam
      : "featured";

  const all = await shop.getProducts(world === "all" ? undefined : world);
  const products = sortProducts(all, sort);

  return (
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      <main className="px-5 pb-24 md:px-12">
        <header className="py-14 text-center md:py-20">
          <p className="mb-4 text-[11px] uppercase tracking-[0.5em] text-[var(--kayra-clay)]">
            The Maison
          </p>
          <h1 className="font-display text-5xl uppercase tracking-[0.22em] md:text-7xl">
            Shop All
          </h1>
        </header>

        <div className="mb-12 flex flex-col gap-6 border-y border-[var(--kayra-walnut)]/15 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {worldFilters.map((filter) => {
              const isActive = world === filter.value;
              return (
                <Link
                  className={`magnetic-focus border px-5 py-2 text-[10px] uppercase tracking-[0.28em] transition ${
                    isActive
                      ? "border-[var(--kayra-walnut)] bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)]"
                      : "border-[var(--kayra-walnut)]/25 hover:border-[var(--kayra-walnut)]"
                  }`}
                  href={link(filter.value, sort)}
                  key={filter.value}
                >
                  {filter.label}
                </Link>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.28em] text-[var(--kayra-walnut)]/45">
              Sort
            </span>
            {sortOptions.map((option) => {
              const isActive = sort === option.value;
              return (
                <Link
                  className={`magnetic-focus text-[10px] uppercase tracking-[0.24em] transition ${
                    isActive
                      ? "text-[var(--kayra-walnut)] underline underline-offset-4"
                      : "text-[var(--kayra-walnut)]/50 hover:text-[var(--kayra-walnut)]"
                  }`}
                  href={link(world, option.value)}
                  key={option.value}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>

        <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/50">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </p>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
