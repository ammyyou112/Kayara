import Link from "next/link";
import type { Metadata } from "next";
import { shop } from "@/lib/shop";
import { getBlock } from "@/lib/shop/blocks";
import type { ProductSort, World } from "@/lib/shop/types";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Shop All",
  description: "Browse all KAYRA clothing and jewelry."
};

const worldFilters: { label: string; value: "all" | World }[] = [
  { label: "All", value: "all" },
  { label: "Clothing", value: "clothing" },
  { label: "Jewelry", value: "jewelry" }
];

const sortOptions: { label: string; value: ProductSort }[] = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" }
];

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
  const sort: ProductSort =
    sortOptions.find((option) => option.value === sortParam)?.value ?? "featured";

  const [products, header] = await Promise.all([
    shop.getProducts({
      world: world === "all" ? undefined : world,
      sort
    }),
    getBlock("shop-header")
  ]);
  const title = world === "all" ? "Shop All" : world === "clothing" ? "Clothing" : "Jewelry";

  return (
    <main className="px-5 pb-24 md:px-8 xl:px-12">
      <header className="py-12 text-center md:py-20">
        <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
          {header.eyebrow}
        </p>
        <h1 className="font-display text-4xl uppercase tracking-[0.18em] sm:text-5xl md:text-7xl md:tracking-[0.22em]">
          {title}
        </h1>
      </header>

      <div className="mb-10 flex flex-col gap-4 border-y border-[var(--kayra-walnut)]/15 py-4 lg:flex-row lg:items-center lg:justify-between">
        <nav aria-label="Filter" className="flex flex-wrap gap-2">
          {worldFilters.map((filter) => {
            const isActive = world === filter.value;
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`magnetic-focus border px-4 py-2 text-[10px] uppercase tracking-[0.24em] transition sm:px-5 ${
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
        </nav>

        <nav
          aria-label="Sort"
          className="no-scrollbar -mx-5 flex items-center gap-5 overflow-x-auto px-5 lg:mx-0 lg:px-0"
        >
          <span className="shrink-0 text-[10px] uppercase tracking-[0.28em] text-[var(--kayra-walnut)]/45">
            Sort
          </span>
          {sortOptions.map((option) => {
            const isActive = sort === option.value;
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`magnetic-focus shrink-0 whitespace-nowrap py-1 text-[10px] uppercase tracking-[0.2em] transition ${
                  isActive
                    ? "text-[var(--kayra-walnut)] underline underline-offset-4"
                    : "text-[var(--kayra-walnut)]/55 hover:text-[var(--kayra-walnut)]"
                }`}
                href={link(world, option.value)}
                key={option.value}
              >
                {option.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <p className="mb-8 text-[11px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/55">
        {products.length} {products.length === 1 ? "piece" : "pieces"}
      </p>

      {products.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="py-16 text-center text-sm uppercase tracking-[0.26em] text-[var(--kayra-walnut)]/55">
          No pieces here yet.
        </p>
      )}
    </main>
  );
}
