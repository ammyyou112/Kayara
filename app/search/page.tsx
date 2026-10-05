import type { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";
import { shop } from "@/lib/shop";
import { ProductCard } from "@/components/shop/ProductCard";

export const metadata: Metadata = {
  title: "Search",
  description: "Search KAYRA clothing and jewelry."
};

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query ? await shop.searchProducts(query) : [];

  return (
    <>

      <main className="mx-auto max-w-5xl px-5 pb-24 md:px-8">
        <header className="py-12 text-center md:py-20">
          <h1 className="font-display text-4xl uppercase tracking-[0.2em] sm:text-5xl md:text-6xl md:tracking-[0.24em]">
            Search
          </h1>

          <form action="/search" className="mx-auto mt-10 max-w-xl" method="get">
            <div className="flex items-center gap-3 border-b border-[var(--kayra-walnut)]/30 pb-3">
              <SearchIcon
                aria-hidden="true"
                className="text-[var(--kayra-walnut)]/50"
                size={18}
                strokeWidth={1.4}
              />
              <input
                aria-label="Search products"
                autoComplete="off"
                className="w-full min-w-0 bg-transparent text-base uppercase tracking-[0.16em] outline-none md:text-sm md:tracking-[0.22em] placeholder:text-[var(--kayra-walnut)]/40"
                defaultValue={query}
                name="q"
                placeholder="Search pieces, collections…"
                type="search"
              />
              <button
                className="magnetic-focus shrink-0 px-1 py-2 text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/60 transition hover:text-[var(--kayra-walnut)]"
                type="submit"
              >
                Go
              </button>
            </div>
          </form>
        </header>

        {query ? (
          <section>
            <p className="mb-8 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)]/55">
              {results.length === 0
                ? `No pieces match “${query}”`
                : `${results.length} ${results.length === 1 ? "result" : "results"} for “${query}”`}
            </p>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-3">
                {results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}
          </section>
        ) : (
          <p className="text-center text-sm uppercase tracking-[0.28em] text-[var(--kayra-walnut)]/50">
            Search clothing and jewelry by name, collection, or world.
          </p>
        )}
      </main>
    </>
  );
}
