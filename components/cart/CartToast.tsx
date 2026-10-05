"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "@/components/cart/CartProvider";
import { Media } from "@/components/site/Media";
import { formatMoney, variantLabel } from "@/lib/format";

const AUTO_HIDE_MS = 5000;

/** "Added to bag" confirmation that slides in under the header. */
export function CartToast() {
  const { lastAdded, dismissLastAdded, cart } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    if (!lastAdded) {
      return;
    }
    const timer = window.setTimeout(dismissLastAdded, AUTO_HIDE_MS);
    return () => window.clearTimeout(timer);
  }, [lastAdded, dismissLastAdded]);

  useEffect(() => {
    dismissLastAdded();
  }, [pathname, dismissLastAdded]);

  const line = lastAdded?.line;
  const checkoutIsExternal = cart?.checkoutUrl.startsWith("http");

  return (
    <AnimatePresence>
      {line ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          aria-live="polite"
          className="fixed inset-x-3 top-16 z-[60] border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-cream)] p-4 text-[var(--kayra-walnut)] shadow-[0_24px_60px_-24px_rgba(0,0,0,0.45)] sm:left-auto sm:right-5 sm:w-[22rem] md:top-20"
          exit={{ opacity: 0, y: -12 }}
          initial={{ opacity: 0, y: -12 }}
          key={lastAdded.key}
          role="status"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center justify-between">
            <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em]">
              <Check size={13} strokeWidth={1.6} />
              Added to bag
            </p>
            <button
              aria-label="Dismiss"
              className="magnetic-focus -mr-1 grid h-8 w-8 place-items-center text-[var(--kayra-walnut)]/60 transition hover:text-[var(--kayra-walnut)]"
              onClick={dismissLastAdded}
              type="button"
            >
              <X size={15} strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-3 flex gap-4">
            <div className="relative h-20 w-16 shrink-0 overflow-hidden border border-[var(--kayra-walnut)]/15 bg-[var(--kayra-ivory)]">
              <Media alt={line.product.title} sizes="64px" src={line.product.image?.url ?? ""} />
            </div>
            <div className="min-w-0">
              <p className="font-display text-base uppercase leading-tight tracking-[0.12em]">
                {line.product.title}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--kayra-walnut)]/60">
                {variantLabel(line.variant)}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.16em]">
                {formatMoney(line.variant.price)}
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Link
              className="magnetic-focus inline-flex h-11 items-center justify-center border border-[var(--kayra-walnut)]/30 text-[10px] uppercase tracking-[0.26em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
              href="/cart"
            >
              View bag ({cart?.totalQuantity ?? 0})
            </Link>
            {checkoutIsExternal ? (
              <a
                className="magnetic-focus inline-flex h-11 items-center justify-center bg-[var(--kayra-walnut)] text-[10px] uppercase tracking-[0.26em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
                href={cart?.checkoutUrl}
              >
                Checkout
              </a>
            ) : (
              <Link
                className="magnetic-focus inline-flex h-11 items-center justify-center bg-[var(--kayra-walnut)] text-[10px] uppercase tracking-[0.26em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
                href={cart?.checkoutUrl ?? "/checkout"}
              >
                Checkout
              </Link>
            )}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
