"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { Media } from "@/components/site/Media";
import { KayraMark } from "@/components/landing/KayraMark";
import { gate } from "@/lib/images";

type World = "clothing" | "jewelry";

const worlds: {
  id: World;
  href: string;
  eyebrow: string;
  title: string;
  parenthetical: string;
  action: string;
  image: string;
}[] = [
  {
    id: "clothing",
    href: "/clothing",
    eyebrow: "Warm editorial",
    title: "Clothing",
    parenthetical: "Pret · Bridal",
    action: "Enter Atelier",
    image: gate.clothing
  },
  {
    id: "jewelry",
    href: "/jewelry",
    eyebrow: "Dark jewel-box",
    title: "Jewelry",
    parenthetical: "Heirloom",
    action: "Enter the Edit",
    image: gate.jewelry
  }
];

export function EntryGate() {
  const [active, setActive] = useState<World | null>(null);

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-[var(--jewel-black)]">
      {/* Brand header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-5 text-[var(--kayra-ivory)] md:px-10">
        <span className="text-[10px] uppercase tracking-[0.34em] opacity-70">
          Est. Karachi
        </span>
        <div className="flex items-center gap-5">
          <Link
            aria-label="Search"
            className="pointer-events-auto transition hover:opacity-60"
            href="/search"
          >
            <Search size={17} strokeWidth={1.4} />
          </Link>
          <Link
            aria-label="Bag"
            className="pointer-events-auto transition hover:opacity-60"
            href="/cart"
          >
            <ShoppingBag size={17} strokeWidth={1.4} />
          </Link>
        </div>
      </div>

      {/* Top scrim — keeps the masthead and utilities legible over imagery */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-2/5 bg-[linear-gradient(180deg,rgba(9,7,6,0.7),transparent)]"
      />

      {/* Masthead */}
      <div className="pointer-events-none absolute inset-x-0 top-[15%] z-30 flex flex-col items-center text-center text-[var(--kayra-ivory)]">
        <KayraMark className="h-12 w-12 stroke-[1.4] md:h-14 md:w-14" />
        <p className="mt-5 font-display text-4xl uppercase tracking-[0.5em] md:text-6xl">
          KAYRA
        </p>
        <div className="mt-6 flex items-center gap-4 text-[10px] uppercase tracking-[0.46em] text-[var(--kayra-ivory)]/85">
          <span className="h-px w-8 bg-[var(--kayra-ivory)]/45" />
          Select your world
          <span className="h-px w-8 bg-[var(--kayra-ivory)]/45" />
        </div>
      </div>

      {/* Two-world chooser */}
      <div className="flex h-full flex-col md:flex-row">
        {worlds.map((world, i) => {
          const isActive = active === world.id;
          const isOther = active !== null && !isActive;
          const basis = isActive
            ? "md:basis-[56%]"
            : isOther
              ? "md:basis-[44%]"
              : "md:basis-1/2";

          return (
            <motion.div
              animate={{ opacity: 1 }}
              className={`relative h-1/2 md:h-full ${basis} transition-[flex-basis] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}
              initial={{ opacity: 0 }}
              key={world.id}
              transition={{ duration: 1, delay: 0.15 * i, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                className="group block h-full w-full"
                href={world.href}
                onMouseEnter={() => setActive(world.id)}
                onMouseLeave={() => setActive(null)}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "scale-105" : "scale-100"
                  }`}
                >
                  <Media
                    alt={`${world.title} — KAYRA`}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    src={world.image}
                  />
                </div>
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 transition-all duration-700 ${
                    isOther
                      ? "bg-[rgba(9,7,6,0.78)]"
                      : "bg-[linear-gradient(180deg,rgba(9,7,6,0.35),rgba(9,7,6,0.72))]"
                  }`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 text-center text-[var(--kayra-ivory)] md:pb-20">
                  <p className="text-[10px] uppercase tracking-[0.5em] text-[var(--kayra-gold)]">
                    {world.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-5xl uppercase tracking-[0.16em] md:text-7xl">
                    {world.title}
                  </h2>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.4em] opacity-70">
                    ({world.parenthetical})
                  </p>
                  <span className="magnetic-focus mt-7 inline-flex h-12 items-center gap-3 border border-[var(--kayra-ivory)]/45 px-7 text-[10px] uppercase tracking-[0.32em] transition duration-500 group-hover:bg-[var(--kayra-ivory)] group-hover:text-[var(--kayra-walnut)]">
                    {world.action}
                    <ArrowUpRight size={15} strokeWidth={1.4} />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
