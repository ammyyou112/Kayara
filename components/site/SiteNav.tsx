"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

type Tone = "light" | "dark";

type MenuGroup = {
  label: string;
  href: string;
  links: { label: string; href: string }[];
};

const groups: MenuGroup[] = [
  {
    label: "Clothing",
    href: "/clothing",
    links: [
      { label: "Luxe Pret", href: "/clothing/collections/luxe-pret" },
      { label: "Bridal", href: "/clothing/collections/bridal" }
    ]
  },
  {
    label: "Jewelry",
    href: "/jewelry",
    links: [{ label: "Heirloom", href: "/jewelry/collections/heirloom" }]
  }
];

const flat = [
  { label: "Shop All", href: "/shop" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "About", href: "/about" }
];

const tones: Record<Tone, { shell: string; panel: string; border: string }> = {
  light: {
    shell:
      "bg-[var(--kayra-cream)]/85 text-[var(--kayra-walnut)] border-[var(--kayra-walnut)]/12",
    panel:
      "bg-[var(--kayra-cream)] text-[var(--kayra-walnut)] border-[var(--kayra-walnut)]/12",
    border: "border-[var(--kayra-walnut)]/12"
  },
  dark: {
    shell:
      "bg-[var(--jewel-black)]/75 text-[var(--jewel-pearl)] border-[var(--jewel-champagne)]/18",
    panel:
      "bg-[var(--jewel-charcoal)] text-[var(--jewel-pearl)] border-[var(--jewel-champagne)]/18",
    border: "border-[var(--jewel-champagne)]/18"
  }
};

export function SiteNav({ tone = "light" }: { tone?: Tone }) {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);
  const t = tones[tone];

  return (
    <header
      className={`sticky top-0 z-40 border-b backdrop-blur-md ${t.shell}`}
    >
      <div className="relative flex items-center justify-between px-5 py-4 md:px-12">
        {/* Left: desktop nav */}
        <nav className="hidden items-center gap-7 text-[10px] uppercase tracking-[0.3em] lg:flex">
          {groups.map((group) => (
            <div className="group relative" key={group.label}>
              <Link
                className="magnetic-focus inline-block py-2 transition hover:opacity-60"
                href={group.href}
              >
                {group.label}
              </Link>
              <div
                className={`invisible absolute left-0 top-full min-w-52 -translate-y-1 border p-5 opacity-0 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${t.panel}`}
              >
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        className="magnetic-focus block whitespace-nowrap text-[11px] tracking-[0.22em] transition hover:opacity-60"
                        href={link.href}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          {flat.map((link) => (
            <Link
              className="magnetic-focus py-2 transition hover:opacity-60"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Left: mobile menu toggle */}
        <button
          aria-label="Open menu"
          className="magnetic-focus lg:hidden"
          onClick={() => setOpen(true)}
          type="button"
        >
          <Menu size={20} strokeWidth={1.4} />
        </button>

        {/* Center: wordmark (absolutely centred so it never drifts with the
            differing widths of the nav and the utilities) */}
        <Link
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-xl tracking-[0.5em] md:text-2xl"
          href="/"
        >
          KAYRA
        </Link>

        {/* Right: utilities */}
        <div className="flex items-center gap-5">
          <Link
            aria-label="Search"
            className="magnetic-focus transition hover:opacity-60"
            href="/search"
          >
            <Search size={18} strokeWidth={1.4} />
          </Link>
          <Link
            aria-label={`Bag, ${ready ? count : 0} items`}
            className="magnetic-focus relative inline-flex items-center transition hover:opacity-60"
            href="/cart"
          >
            <ShoppingBag size={18} strokeWidth={1.4} />
            {ready && count > 0 ? (
              <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[var(--kayra-clay)] text-[9px] tabular-nums text-[var(--kayra-ivory)]">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {/* Mobile overlay menu */}
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--kayra-cream)] px-6 py-5 text-[var(--kayra-walnut)] lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-xl tracking-[0.5em]">KAYRA</span>
            <button
              aria-label="Close menu"
              className="magnetic-focus"
              onClick={() => setOpen(false)}
              type="button"
            >
              <X size={22} strokeWidth={1.4} />
            </button>
          </div>
          <nav className="mt-14 flex flex-col gap-7">
            {groups.map((group) => (
              <div key={group.label}>
                <Link
                  className="font-display text-3xl uppercase tracking-[0.18em]"
                  href={group.href}
                  onClick={() => setOpen(false)}
                >
                  {group.label}
                </Link>
                <div className="mt-3 flex flex-col gap-2 pl-1 text-[11px] uppercase tracking-[0.28em] text-[var(--kayra-walnut)]/60">
                  {group.links.map((link) => (
                    <Link
                      href={link.href}
                      key={link.href}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            {flat.map((link) => (
              <Link
                className="font-display text-3xl uppercase tracking-[0.18em]"
                href={link.href}
                key={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
