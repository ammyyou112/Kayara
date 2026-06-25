import type { Metadata } from "next";
import { Search as SearchIcon } from "lucide-react";
import { shop } from "@/lib/shop";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
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
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      <main className="mx-auto max-w-5xl px-5 pb-24 md:px-8">
        <header className="py-14 text-center md:py-20">
          <h1 className="font-display text-5xl uppercase tracking-[0.24em] md:text-6xl">
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
                autoFocus
                className="w-full bg-transparent text-sm uppercase tracking-[0.22em] outline-none placeholder:text-[var(--kayra-walnut)]/40"
                defaultValue={query}
                name="q"
                placeholder="Search pieces, collections…"
                type="search"
              />
              <button
                className="magnetic-focus text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/60 transition hover:text-[var(--kayra-walnut)]"
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
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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

      <SiteFooter />
    </div>
  );
}
