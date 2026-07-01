"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Media } from "@/components/site/Media";
import { formatMoney } from "@/lib/format";

const inputClass =
  "w-full border-b border-[var(--kayra-walnut)]/25 bg-transparent py-2 text-sm tracking-[0.08em] outline-none transition focus:border-[var(--kayra-walnut)] placeholder:text-[var(--kayra-walnut)]/40";
const labelClass =
  "text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/55";

export default function CheckoutPage() {
  const { lines, subtotal, ready, clear } = useCart();
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postal: "",
    phone: "",
    card: "",
    exp: "",
    cvc: ""
  });

  const set =
    (key: keyof typeof form) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const shipping = 0;
  const total = subtotal + shipping;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const ref = `KAYRA-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(ref);
    setPlaced(true);
    clear();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
      <SiteNav tone="light" />

      <main className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {placed ? (
          <section className="grid min-h-[60vh] place-items-center py-16 text-center">
            <div className="max-w-lg">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)]">
                <Check size={24} strokeWidth={1.6} />
              </span>
              <h1 className="mt-8 font-display text-4xl uppercase tracking-[0.22em] md:text-5xl">
                Order Confirmed
              </h1>
              <p className="mt-5 text-[11px] uppercase tracking-[0.32em] text-[var(--kayra-walnut)]/60">
                Order {orderId}
              </p>
              <p className="mt-5 text-sm uppercase leading-7 tracking-[0.22em] text-[var(--kayra-walnut)]/65">
                Thank you. A confirmation has been sent to
                {email ? ` ${email}` : " your email"}. Our atelier will be in
                touch shortly.
              </p>
              <Link
                className="magnetic-focus mt-10 inline-flex h-14 items-center gap-3 border border-[var(--kayra-walnut)]/30 px-8 text-[11px] uppercase tracking-[0.32em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                href="/"
              >
                Continue Shopping
              </Link>
            </div>
          </section>
        ) : !ready ? null : lines.length === 0 ? (
          <section className="grid min-h-[50vh] place-items-center py-16 text-center">
            <div>
              <h1 className="font-display text-4xl uppercase tracking-[0.24em] md:text-5xl">
                Checkout
              </h1>
              <p className="mt-6 text-sm uppercase tracking-[0.26em] text-[var(--kayra-walnut)]/60">
                Your bag is empty.
              </p>
              <Link
                className="magnetic-focus mt-10 inline-flex h-14 items-center border border-[var(--kayra-walnut)]/30 px-8 text-[11px] uppercase tracking-[0.32em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
                href="/shop"
              >
                Continue Shopping
              </Link>
            </div>
          </section>
        ) : (
          <>
            <header className="border-b border-[var(--kayra-walnut)]/15 py-12 text-center">
              <h1 className="font-display text-4xl uppercase tracking-[0.24em] md:text-5xl">
                Checkout
              </h1>
            </header>

            <form
              className="grid gap-14 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20"
              onSubmit={submit}
            >
              {/* Details */}
              <div className="space-y-12">
                <fieldset className="space-y-5">
                  <legend className="mb-2 font-display text-xl uppercase tracking-[0.2em]">
                    Contact
                  </legend>
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
                  <legend className="mb-2 font-display text-xl uppercase tracking-[0.2em]">
                    Shipping
                  </legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="firstName">
                        First name
                      </label>
                      <input
                        className={inputClass}
                        id="firstName"
                        onChange={set("firstName")}
                        required
                        value={form.firstName}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="lastName">
                        Last name
                      </label>
                      <input
                        className={inputClass}
                        id="lastName"
                        onChange={set("lastName")}
                        required
                        value={form.lastName}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass} htmlFor="address">
                      Address
                    </label>
                    <input
                      className={inputClass}
                      id="address"
                      onChange={set("address")}
                      required
                      value={form.address}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className={labelClass} htmlFor="city">
                        City
                      </label>
                      <input
                        className={inputClass}
                        id="city"
                        onChange={set("city")}
                        required
                        value={form.city}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="postal">
                        Postal code
                      </label>
                      <input
                        className={inputClass}
                        id="postal"
                        onChange={set("postal")}
                        required
                        value={form.postal}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="phone">
                        Phone
                      </label>
                      <input
                        className={inputClass}
                        id="phone"
                        onChange={set("phone")}
                        required
                        type="tel"
                        value={form.phone}
                      />
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-5">
                  <legend className="mb-2 flex items-center gap-2 font-display text-xl uppercase tracking-[0.2em]">
                    Payment
                    <Lock size={13} strokeWidth={1.6} />
                  </legend>
                  <div>
                    <label className={labelClass} htmlFor="card">
                      Card number
                    </label>
                    <input
                      className={inputClass}
                      id="card"
                      inputMode="numeric"
                      onChange={set("card")}
                      placeholder="4242 4242 4242 4242"
                      required
                      value={form.card}
                    />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="exp">
                        Expiry (MM/YY)
                      </label>
                      <input
                        className={inputClass}
                        id="exp"
                        onChange={set("exp")}
                        placeholder="08/28"
                        required
                        value={form.exp}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="cvc">
                        CVC
                      </label>
                      <input
                        className={inputClass}
                        id="cvc"
                        inputMode="numeric"
                        onChange={set("cvc")}
                        placeholder="123"
                        required
                        value={form.cvc}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--kayra-walnut)]/45">
                    Demo checkout — no payment is processed.
                  </p>
                </fieldset>
              </div>

              {/* Order summary */}
              <aside className="h-max lg:sticky lg:top-28">
                <div className="border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-ivory)]/40 p-6 md:p-8">
                  <h2 className="mb-6 font-display text-xl uppercase tracking-[0.2em]">
                    Your Order
                  </h2>
                  <ul className="space-y-5">
                    {lines.map((line) => (
                      <li className="flex gap-4" key={line.id}>
                        <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-[var(--kayra-walnut)]/15">
                          <Media
                            alt={line.product.title}
                            sizes="64px"
                            src={line.product.images[0]?.url ?? ""}
                          />
                          <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-[var(--kayra-walnut)] text-[9px] tabular-nums text-[var(--kayra-ivory)]">
                            {line.quantity}
                          </span>
                        </div>
                        <div className="flex flex-1 items-center justify-between gap-2">
                          <div>
                            <p className="font-display text-sm uppercase tracking-[0.14em]">
                              {line.product.title}
                            </p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.24em] text-[var(--kayra-walnut)]/55">
                              {line.variant.selectedOptions.Size
                                ? `Size ${line.variant.selectedOptions.Size}`
                                : line.variant.title}
                            </p>
                          </div>
                          <p className="shrink-0 text-[11px] uppercase tracking-[0.16em]">
                            {formatMoney({
                              amount: line.variant.price.amount * line.quantity,
                              currencyCode: line.variant.price.currencyCode
                            })}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-8 space-y-3 border-t border-[var(--kayra-walnut)]/15 pt-6 text-[11px] uppercase tracking-[0.22em]">
                    <div className="flex justify-between">
                      <dt className="text-[var(--kayra-walnut)]/60">Subtotal</dt>
                      <dd>{formatMoney({ amount: subtotal, currencyCode: "PKR" })}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-[var(--kayra-walnut)]/60">Shipping</dt>
                      <dd>Complimentary</dd>
                    </div>
                    <div className="flex justify-between border-t border-[var(--kayra-walnut)]/15 pt-3 text-sm">
                      <dt>Total</dt>
                      <dd className="tabular-nums">
                        {formatMoney({ amount: total, currencyCode: "PKR" })}
                      </dd>
                    </div>
                  </dl>

                  <button
                    className="magnetic-focus mt-8 inline-flex h-14 w-full items-center justify-center bg-[var(--kayra-walnut)] px-8 text-[11px] uppercase tracking-[0.34em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
                    type="submit"
                  >
                    Place Order
                  </button>
                  <Link
                    className="magnetic-focus mt-4 block text-center text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/55 transition hover:text-[var(--kayra-walnut)]"
                    href="/cart"
                  >
                    Return to bag
                  </Link>
                </div>
              </aside>
            </form>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
