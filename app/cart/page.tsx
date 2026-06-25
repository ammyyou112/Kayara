"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Media } from "@/components/site/Media";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { formatMoney, productHref } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, count, ready, setQuantity, removeLine } = useCart();

  return (
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      <main className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
        <header className="border-b border-[var(--kayra-walnut)]/15 py-14 text-center">
          <h1 className="font-display text-5xl uppercase tracking-[0.24em] md:text-6xl">
            Bag
          </h1>
          {ready ? (
            <p className="mt-4 text-[11px] uppercase tracking-[0.34em] text-[var(--kayra-walnut)]/55">
              {count === 0 ? "Empty" : `${count} ${count === 1 ? "piece" : "pieces"}`}
            </p>
          ) : null}
        </header>

        {!ready ? null : lines.length === 0 ? (
          <section className="py-20 text-center">
            <p className="text-sm uppercase leading-7 tracking-[0.26em] text-[var(--kayra-walnut)]/60">
              Your bag is empty.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                className="magnetic-focus inline-flex items-center border border-[var(--kayra-walnut)]/30 px-7 py-4 text-[11px] uppercase tracking-[0.32em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                href="/clothing"
              >
                Shop Clothing
              </Link>
              <Link
                className="magnetic-focus inline-flex items-center border border-[var(--kayra-walnut)]/30 px-7 py-4 text-[11px] uppercase tracking-[0.32em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                href="/jewelry"
              >
                Shop Jewelry
              </Link>
            </div>
          </section>
        ) : (
          <section className="py-10">
            <ul className="divide-y divide-[var(--kayra-walnut)]/12">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-5 py-6">
                  <Link
                    className="relative h-28 w-24 shrink-0 overflow-hidden border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-ivory)]/50"
                    href={productHref(line.product.world, line.product.handle)}
                  >
                    <Media
                      alt={line.product.title}
                      sizes="96px"
                      src={line.product.images[0]?.url ?? ""}
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link
                          className="font-display text-lg uppercase tracking-[0.16em] transition hover:opacity-60"
                          href={productHref(line.product.world, line.product.handle)}
                        >
                          {line.product.title}
                        </Link>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/55">
                          {line.variant.selectedOptions.Size
                            ? `Size ${line.variant.selectedOptions.Size}`
                            : line.variant.title}
                        </p>
                      </div>
                      <button
                        aria-label={`Remove ${line.product.title}`}
                        className="magnetic-focus p-1 text-[var(--kayra-walnut)]/50 transition hover:text-[var(--kayra-clay)]"
                        onClick={() => removeLine(line.id)}
                        type="button"
                      >
                        <X size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="inline-flex items-center border border-[var(--kayra-walnut)]/25">
                        <button
                          aria-label="Decrease quantity"
                          className="magnetic-focus grid h-9 w-9 place-items-center transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          type="button"
                        >
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span className="grid h-9 w-9 place-items-center text-xs tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          aria-label="Increase quantity"
                          className="magnetic-focus grid h-9 w-9 place-items-center transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          type="button"
                        >
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm uppercase tracking-[0.18em]">
                        {formatMoney({
                          amount: line.variant.price.amount * line.quantity,
                          currencyCode: line.variant.price.currencyCode
                        })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-10 border-t border-[var(--kayra-walnut)]/15 pt-8">
              <div className="flex items-center justify-between text-sm uppercase tracking-[0.24em]">
                <span>Subtotal</span>
                <span className="tabular-nums">
                  {formatMoney({ amount: subtotal, currencyCode: "PKR" })}
                </span>
              </div>
              <p className="mt-3 text-[10px] uppercase leading-6 tracking-[0.28em] text-[var(--kayra-walnut)]/50">
                Taxes and shipping calculated at checkout. Secure Shopify checkout
                connects at launch.
              </p>
              <button
                className="magnetic-focus mt-7 inline-flex h-14 w-full items-center justify-center bg-[var(--kayra-walnut)] px-8 text-[11px] uppercase tracking-[0.34em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
                type="button"
              >
                Proceed to checkout
              </button>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
