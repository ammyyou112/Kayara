"use client";

import Link from "next/link";
import { Lock, Minus, Plus, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Media } from "@/components/site/Media";
import { formatMoney, productHref, variantLabel } from "@/lib/format";

const outlineBtn =
  "magnetic-focus inline-flex items-center justify-center border border-[var(--kayra-walnut)]/30 px-7 py-4 text-[11px] uppercase tracking-[0.3em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]";

export default function CartPage() {
  const { cart, lines, count, ready, pending, error, setQuantity, removeLine } = useCart();
  const checkoutUrl = cart?.checkoutUrl ?? "/checkout";
  const isShopifyCheckout = checkoutUrl.startsWith("http");

  return (
    <main className="mx-auto max-w-4xl px-5 pb-24 md:px-8">
      <header className="border-b border-[var(--kayra-walnut)]/15 py-12 text-center md:py-14">
        <h1 className="font-display text-5xl uppercase tracking-[0.22em] md:text-6xl">Bag</h1>
        <p className="mt-4 h-4 text-[11px] uppercase tracking-[0.34em] text-[var(--kayra-walnut)]/55">
          {ready ? (count === 0 ? "Empty" : `${count} ${count === 1 ? "piece" : "pieces"}`) : ""}
        </p>
      </header>

      {!ready ? (
        <div aria-busy="true" className="space-y-6 py-10">
          {[0, 1].map((key) => (
            <div className="flex animate-pulse gap-5" key={key}>
              <div className="h-28 w-24 bg-[var(--kayra-walnut)]/8" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="h-4 w-1/2 bg-[var(--kayra-walnut)]/8" />
                <div className="h-3 w-1/4 bg-[var(--kayra-walnut)]/8" />
              </div>
            </div>
          ))}
        </div>
      ) : lines.length === 0 ? (
        <section className="py-20 text-center">
          <p className="text-sm uppercase leading-7 tracking-[0.26em] text-[var(--kayra-walnut)]/60">
            Your bag is empty.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link className={outlineBtn} href="/shop?world=clothing">
              Shop Clothing
            </Link>
            <Link className={outlineBtn} href="/jewelry">
              Shop Jewelry
            </Link>
          </div>
        </section>
      ) : (
        <section className={`py-8 transition-opacity md:py-10 ${pending ? "opacity-70" : ""}`}>
          {error ? (
            <p className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[var(--kayra-clay)]" role="alert">
              {error}
            </p>
          ) : null}

          <ul className="divide-y divide-[var(--kayra-walnut)]/12">
            {lines.map((line) => {
              const href = productHref(line.product.world, line.product.handle);
              const label = variantLabel(line.variant);
              return (
                <li className="flex gap-4 py-6 sm:gap-5" key={line.id}>
                  <Link
                    className="relative h-28 w-22 shrink-0 overflow-hidden border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-ivory)]/50 sm:w-24"
                    href={href}
                  >
                    <Media
                      alt={line.product.image?.altText ?? line.product.title}
                      sizes="96px"
                      src={line.product.image?.url ?? ""}
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link
                          className="font-display text-base uppercase leading-snug tracking-[0.12em] transition hover:opacity-60 sm:text-lg sm:tracking-[0.16em]"
                          href={href}
                        >
                          {line.product.title}
                        </Link>
                        {label ? (
                          <p className="mt-1 text-[10px] uppercase tracking-[0.26em] text-[var(--kayra-walnut)]/55">
                            {label}
                          </p>
                        ) : null}
                        {!line.variant.availableForSale ? (
                          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--kayra-clay)]">
                            No longer available
                          </p>
                        ) : null}
                      </div>
                      <button
                        aria-label={`Remove ${line.product.title}`}
                        className="magnetic-focus -mr-2 -mt-2 grid h-10 w-10 shrink-0 place-items-center text-[var(--kayra-walnut)]/50 transition hover:text-[var(--kayra-clay)]"
                        onClick={() => removeLine(line.id)}
                        type="button"
                      >
                        <X size={16} strokeWidth={1.5} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div className="inline-flex items-center border border-[var(--kayra-walnut)]/25">
                        <button
                          aria-label={`Decrease quantity of ${line.product.title}`}
                          className="magnetic-focus grid h-10 w-10 place-items-center transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                          onClick={() => setQuantity(line.id, line.quantity - 1)}
                          type="button"
                        >
                          <Minus size={14} strokeWidth={1.5} />
                        </button>
                        <span aria-live="polite" className="grid h-10 w-9 place-items-center text-xs tabular-nums">
                          {line.quantity}
                        </span>
                        <button
                          aria-label={`Increase quantity of ${line.product.title}`}
                          className="magnetic-focus grid h-10 w-10 place-items-center transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                          onClick={() => setQuantity(line.id, line.quantity + 1)}
                          type="button"
                        >
                          <Plus size={14} strokeWidth={1.5} />
                        </button>
                      </div>
                      <p className="text-sm uppercase tracking-[0.14em] tabular-nums">
                        {formatMoney(line.cost.totalAmount)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 border-t border-[var(--kayra-walnut)]/15 pt-8">
            <div className="flex items-center justify-between text-sm uppercase tracking-[0.22em]">
              <span>Subtotal</span>
              <span className="tabular-nums">
                {cart ? formatMoney(cart.cost.subtotalAmount) : ""}
              </span>
            </div>
            <p className="mt-3 text-[10px] uppercase leading-6 tracking-[0.26em] text-[var(--kayra-walnut)]/55">
              Shipping, taxes and discount codes are applied at checkout.
            </p>
            {isShopifyCheckout ? (
              <a
                className="magnetic-focus mt-7 inline-flex h-14 w-full items-center justify-center gap-3 bg-[var(--kayra-walnut)] px-8 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
                href={checkoutUrl}
              >
                <Lock size={13} strokeWidth={1.6} />
                Secure checkout
              </a>
            ) : (
              <Link
                className="magnetic-focus mt-7 inline-flex h-14 w-full items-center justify-center bg-[var(--kayra-walnut)] px-8 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
                href={checkoutUrl}
              >
                Proceed to checkout
              </Link>
            )}
            <Link
              className="magnetic-focus mt-4 block text-center text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/60 transition hover:text-[var(--kayra-walnut)]"
              href="/shop"
            >
              Continue shopping
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
