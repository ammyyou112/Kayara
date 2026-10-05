"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";
import type { MenuItem } from "@/lib/shop/types";

const isExternal = (href: string) => /^https?:\/\//.test(href);

function NavLink({
  item,
  className,
  onClick
}: {
  item: MenuItem;
  className?: string;
  onClick?: () => void;
}) {
  if (isExternal(item.href)) {
    return (
      <a className={className} href={item.href} onClick={onClick} rel="noreferrer" target="_blank">
        {item.title}
      </a>
    );
  }
  return (
    <Link className={className} href={item.href || "#"} onClick={onClick}>
      {item.title}
    </Link>
  );
}

function CountBadge({ count }: { count: number }) {
  return count > 0 ? (
    <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-[var(--kayra-clay)] px-1 text-[9px] tabular-nums text-[var(--kayra-ivory)]">
      {count > 99 ? "99+" : count}
    </span>
  ) : null;
}

export function SiteNavClient({ menu }: { menu: MenuItem[] }) {
  const { count, ready } = useCart();
  const { count: wishCount, ready: wishReady } = useWishlist();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock page scroll and allow Escape to close while the menu is open.
  useEffect(() => {
    if (!open) {
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--kayra-walnut)]/12 bg-[var(--kayra-cream)]/90 text-[var(--kayra-walnut)] backdrop-blur-md">
        <div className="relative flex h-14 items-center justify-between px-4 sm:px-5 md:h-16 md:px-8 xl:px-12">
          {/* Left: desktop nav */}
          <nav
            aria-label="Main"
            className="hidden items-center gap-5 text-[10px] uppercase tracking-[0.26em] xl:flex 2xl:gap-7 2xl:tracking-[0.3em]"
          >
            {menu.map((item) =>
              item.items.length ? (
                <div className="group relative" key={item.title}>
                  <NavLink
                    className="magnetic-focus inline-flex items-center gap-1 py-5 transition hover:opacity-60"
                    item={item}
                  />
                  <div className="invisible absolute left-0 top-full min-w-56 -translate-y-1 border border-[var(--kayra-walnut)]/12 bg-[var(--kayra-cream)] p-5 opacity-0 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.5)] transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                    <ul className="space-y-3">
                      {item.items.map((child) => (
                        <li key={child.title + child.href}>
                          <NavLink
                            className="magnetic-focus block whitespace-nowrap text-[11px] tracking-[0.22em] transition hover:opacity-60"
                            item={child}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <NavLink
                  className={`magnetic-focus py-5 transition hover:opacity-60 ${
                    pathname === item.href ? "underline underline-offset-[6px]" : ""
                  }`}
                  item={item}
                  key={item.title + item.href}
                />
              )
            )}
          </nav>

          {/* Left: mobile menu toggle */}
          <button
            aria-controls="mobile-menu"
            aria-expanded={open}
            aria-label="Open menu"
            className="magnetic-focus -ml-2 grid h-10 w-10 place-items-center xl:hidden"
            onClick={() => setOpen(true)}
            type="button"
          >
            <Menu size={20} strokeWidth={1.4} />
          </button>

          {/* Center: wordmark */}
          <Link
            aria-label="KAYRA home"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-lg tracking-[0.32em] md:text-2xl md:tracking-[0.5em]"
            href="/"
          >
            KAYRA
          </Link>

          {/* Right: utilities */}
          <div className="-mr-2 flex items-center">
            <Link
              aria-label="Search"
              className="magnetic-focus grid h-10 w-10 place-items-center transition hover:opacity-60"
              href="/search"
            >
              <Search size={18} strokeWidth={1.4} />
            </Link>
            <Link
              aria-label={`Wishlist, ${wishReady ? wishCount : 0} items`}
              className="magnetic-focus grid h-10 w-10 place-items-center transition hover:opacity-60"
              href="/wishlist"
            >
              <span className="relative">
                <Heart size={18} strokeWidth={1.4} />
                {wishReady ? <CountBadge count={wishCount} /> : null}
              </span>
            </Link>
            <Link
              aria-label={`Bag, ${ready ? count : 0} items`}
              className="magnetic-focus grid h-10 w-10 place-items-center transition hover:opacity-60"
              href="/cart"
            >
              <span className="relative">
                <ShoppingBag size={18} strokeWidth={1.4} />
                {ready ? <CountBadge count={count} /> : null}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu. Rendered outside the header: the header's
          backdrop-filter would otherwise trap this fixed element inside it. */}
      {open ? (
        <div
          aria-label="Menu"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto overscroll-contain bg-[var(--kayra-cream)] px-6 pb-10 pt-4 text-[var(--kayra-walnut)] xl:hidden"
          data-lenis-prevent
          id="mobile-menu"
          role="dialog"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-xl tracking-[0.5em]">KAYRA</span>
            <button
              aria-label="Close menu"
              className="magnetic-focus -mr-2 grid h-10 w-10 place-items-center"
              onClick={close}
              type="button"
            >
              <X size={22} strokeWidth={1.4} />
            </button>
          </div>

          <nav aria-label="Mobile" className="mt-10 flex flex-col divide-y divide-[var(--kayra-walnut)]/10">
            {menu.map((item) =>
              item.items.length ? (
                <div className="py-4" key={item.title}>
                  <button
                    aria-expanded={expanded === item.title}
                    className="flex w-full items-center justify-between font-display text-2xl uppercase tracking-[0.16em] sm:text-3xl"
                    onClick={() => setExpanded((current) => (current === item.title ? null : item.title))}
                    type="button"
                  >
                    {item.title}
                    <ChevronDown
                      className={`transition-transform ${expanded === item.title ? "rotate-180" : ""}`}
                      size={18}
                      strokeWidth={1.4}
                    />
                  </button>
                  {expanded === item.title ? (
                    <div className="mt-4 flex flex-col gap-4 pl-1 text-[11px] uppercase tracking-[0.28em] text-[var(--kayra-walnut)]/70">
                      {item.href && item.href !== "#" ? (
                        <NavLink item={{ ...item, title: `All ${item.title}` }} onClick={close} />
                      ) : null}
                      {item.items.map((child) => (
                        <NavLink item={child} key={child.title + child.href} onClick={close} />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <NavLink
                  className="py-4 font-display text-2xl uppercase tracking-[0.16em] sm:text-3xl"
                  item={item}
                  key={item.title + item.href}
                  onClick={close}
                />
              )
            )}
          </nav>

          <div className="mt-auto flex gap-6 pt-10 text-[10px] uppercase tracking-[0.3em] text-[var(--kayra-walnut)]/70">
            <Link href="/search" onClick={close}>
              Search
            </Link>
            <Link href="/wishlist" onClick={close}>
              Wishlist
            </Link>
            <Link href="/cart" onClick={close}>
              Bag{ready && count ? ` (${count})` : ""}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
