"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { Media } from "@/components/site/Media";
import { formatMoney, variantLabel } from "@/lib/format";

const inputClass =
  "w-full border-b border-[var(--kayra-walnut)]/25 bg-transparent py-2 text-sm tracking-[0.06em] outline-none transition focus:border-[var(--kayra-walnut)] placeholder:text-[var(--kayra-walnut)]/40";
const labelClass = "text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/60";
const outlineBtn =
  "magnetic-focus inline-flex h-14 items-center justify-center gap-3 border border-[var(--kayra-walnut)]/30 px-8 text-[11px] uppercase tracking-[0.3em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]";

// With Shopify connected, checkout is Shopify's hosted, PCI-compliant checkout:
// this route just forwards there. Without Shopify (mock/demo mode) it shows a
// demo order form — it never collects payment details.
export default function CheckoutPage() {
  const { cart, lines, ready, clear } = useCart();
  const [placed, setPlaced] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const shopifyCheckout = cart?.checkoutUrl.startsWith("http") ? cart.checkoutUrl : null;

  useEffect(() => {
    if (shopifyCheckout && lines.length) {
      window.location.assign(shopifyCheckout);
    }
  }, [shopifyCheckout, lines.length]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPlaced(`KAYRA-${Math.floor(100000 + Math.random() * 900000)}`);
    await clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (placed) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-5 py-16 text-center">
        <div className="max-w-lg">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)]">
            <Check size={24} strokeWidth={1.6} />
          </span>
          <h1 className="mt-8 font-display text-4xl uppercase tracking-[0.2em] md:text-5xl">
            Order Received
          </h1>
          <p className="mt-5 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)]/60">
            Demo order {placed}
          </p>
          <p className="mt-5 text-sm uppercase leading-7 tracking-[0.2em] text-[var(--kayra-walnut)]/65">
            Thank you{email ? `, we'll be in touch at ${email}` : ""}. This is the demo storefront —
            no payment was taken.
          </p>
          <Link className={`${outlineBtn} mt-10`} href="/">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (!ready || (shopifyCheckout && lines.length)) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-5 text-center">
        <p className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/60">
          <Loader2 className="animate-spin" size={16} strokeWidth={1.5} />
          {shopifyCheckout ? "Taking you to secure checkout" : "Loading your bag"}
        </p>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-5 py-16 text-center">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-[0.22em] md:text-5xl">Checkout</h1>
          <p className="mt-6 text-sm uppercase tracking-[0.26em] text-[var(--kayra-walnut)]/60">
            Your bag is empty.
          </p>
          <Link className={`${outlineBtn} mt-10`} href="/shop">
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
      <header className="border-b border-[var(--kayra-walnut)]/15 py-12 text-center">
        <h1 className="font-display text-4xl uppercase tracking-[0.22em] md:text-5xl">Checkout</h1>
        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-clay)]">
          Demo mode — connect Shopify to enable real checkout
        </p>
      </header>

      <form className="grid gap-14 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20" onSubmit={submit}>
        <div className="space-y-12">
          <fieldset className="space-y-5">
            <legend className="mb-2 font-display text-xl uppercase tracking-[0.2em]">Contact</legend>
            <div>
              <label className={labelClass} htmlFor="email">
                Email
              </label>
              <input
                autoComplete="email"
                className={inputClass}
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                required
                type="email"
                value={email}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-5">
            <legend className="mb-2 font-display text-xl uppercase tracking-[0.2em]">Shipping</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass} htmlFor="firstName">
                  First name
                </label>
                <input autoComplete="given-name" className={inputClass} id="firstName" required />
              </div>
              <div>
                <label className={labelClass} htmlFor="lastName">
                  Last name
                </label>
                <input autoComplete="family-name" className={inputClass} id="lastName" required />
              </div>
            </div>
            <div>
              <label className={labelClass} htmlFor="address">
                Address
              </label>
              <input autoComplete="street-address" className={inputClass} id="address" required />
            </div>
            <div className="grid gap-5 sm:grid-cols-3">
              <div>
                <label className={labelClass} htmlFor="city">
                  City
                </label>
                <input autoComplete="address-level2" className={inputClass} id="city" required />
              </div>
              <div>
                <label className={labelClass} htmlFor="postal">
                  Postal code
                </label>
                <input autoComplete="postal-code" className={inputClass} id="postal" />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">
                  Phone
                </label>
                <input autoComplete="tel" className={inputClass} id="phone" required type="tel" />
              </div>
            </div>
          </fieldset>

          <p className="border-l-2 border-[var(--kayra-gold)] pl-4 text-[11px] uppercase leading-6 tracking-[0.2em] text-[var(--kayra-walnut)]/65">
            Payment is taken on Shopify&rsquo;s secure checkout once the store is connected. This
            demo never asks for card details.
          </p>
        </div>

        <aside className="h-max lg:sticky lg:top-28">
          <div className="border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-ivory)]/40 p-6 md:p-8">
            <h2 className="mb-6 font-display text-xl uppercase tracking-[0.2em]">Your Order</h2>
            <ul className="space-y-5">
              {lines.map((line) => (
                <li className="flex gap-4" key={line.id}>
                  <div className="relative h-20 w-16 shrink-0 border border-[var(--kayra-walnut)]/15">
                    <div className="absolute inset-0 overflow-hidden">
                      <Media alt={line.product.title} sizes="64px" src={line.product.image?.url ?? ""} />
                    </div>
                    <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--kayra-walnut)] px-1 text-[9px] tabular-nums text-[var(--kayra-ivory)]">
                      {line.quantity}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-sm uppercase leading-snug tracking-[0.12em]">
                        {line.product.title}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[var(--kayra-walnut)]/55">
                        {variantLabel(line.variant)}
                      </p>
                    </div>
                    <p className="shrink-0 text-[11px] uppercase tracking-[0.14em] tabular-nums">
                      {formatMoney(line.cost.totalAmount)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="mt-8 space-y-3 border-t border-[var(--kayra-walnut)]/15 pt-6 text-[11px] uppercase tracking-[0.2em]">
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--kayra-walnut)]/60">Subtotal</dt>
                <dd className="tabular-nums">{cart ? formatMoney(cart.cost.subtotalAmount) : ""}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-[var(--kayra-walnut)]/60">Shipping</dt>
                <dd>Complimentary</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-[var(--kayra-walnut)]/15 pt-3 text-sm">
                <dt>Total</dt>
                <dd className="tabular-nums">{cart ? formatMoney(cart.cost.totalAmount) : ""}</dd>
              </div>
            </dl>

            <button
              className="magnetic-focus mt-8 inline-flex h-14 w-full items-center justify-center bg-[var(--kayra-walnut)] px-8 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
              type="submit"
            >
              Place demo order
            </button>
            <Link
              className="magnetic-focus mt-4 block text-center text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/60 transition hover:text-[var(--kayra-walnut)]"
              href="/cart"
            >
              Return to bag
            </Link>
          </div>
        </aside>
      </form>
    </main>
  );
}
