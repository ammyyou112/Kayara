import type { Page } from "@/lib/shop/types";

/** Plain editorial layout for Shopify Pages and store policies. */
export function RichPage({ page, eyebrow }: { page: Page; eyebrow: string }) {
  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 md:px-8">
      <header className="border-b border-[var(--kayra-walnut)]/15 py-14 text-center md:py-20">
        <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl uppercase leading-tight tracking-[0.16em] md:text-6xl">
          {page.title}
        </h1>
      </header>
      <article
        className="rte py-12 text-[15px] text-[var(--kayra-walnut)]/80"
        // Content is authored by the merchant in the Shopify admin.
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
    </main>
  );
}
