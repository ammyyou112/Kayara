"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import gsap from "gsap";
import { KayraMark } from "./KayraMark";

type World = "clothing" | "jewelry";

const worlds: Record<
  World,
  {
    href: string;
    eyebrow: string;
    title: string;
    parenthetical: string;
    action: string;
    note: string;
  }
> = {
  clothing: {
    href: "/clothing",
    eyebrow: "Warm editorial",
    title: "Luxe Pret",
    parenthetical: "The Wedding Guest",
    action: "Enter Atelier",
    note: "Ivory drape, clay light, architectural calm."
  },
  jewelry: {
    href: "/jewelry",
    eyebrow: "Dark jewel-box",
    title: "Heirloom",
    parenthetical: "The Collection",
    action: "Enter Collection",
    note: "Champagne glints, near-black velvet, held breath."
  }
};

export function SplitLanding() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const [activeWorld, setActiveWorld] = useState<World | null>(null);
  const [cursorLabel, setCursorLabel] = useState("KAYRA");
  const [isLeaving, setIsLeaving] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const cursorX = useSpring(pointerX, { stiffness: 180, damping: 28 });
  const cursorY = useSpring(pointerY, { stiffness: 180, damping: 28 });

  useEffect(() => {
    const root = rootRef.current;
    const loader = loaderRef.current;

    if (!root || !loader) {
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const paths = loader.querySelectorAll(".kayra-mark path");
    const panels = root.querySelectorAll("[data-panel]");
    const copy = root.querySelectorAll("[data-reveal]");

    if (reduced) {
      gsap.set(loader, { autoAlpha: 0, display: "none" });
      gsap.set(panels, { clipPath: "inset(0% 0% 0% 0%)", autoAlpha: 1 });
      gsap.set(copy, { y: 0, autoAlpha: 1 });
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

    timeline
      .set(paths, { strokeDasharray: 1, strokeDashoffset: 1 })
      .set(panels, { clipPath: "inset(0% 50% 0% 50%)", autoAlpha: 1 })
      .set(copy, { y: 36, autoAlpha: 0 })
      .to(paths, {
        strokeDashoffset: 0,
        duration: 1.35,
        stagger: 0.14,
        ease: "power2.inOut"
      })
      .to(loader, { yPercent: -102, duration: 1, ease: "expo.inOut" }, "+=0.2")
      .to(
        panels,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.05, ease: "expo.inOut" },
        "-=0.78"
      )
      .to(
        copy,
        { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 },
        "-=0.45"
      )
      .set(loader, { display: "none" });

    return () => {
      timeline.kill();
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    pointerX.set(event.clientX);
    pointerY.set(event.clientY);
  };

  const setWorld = (world: World | null) => {
    setActiveWorld(world);
    setCursorLabel(world ? worlds[world].action : "KAYRA");
  };

  return (
    <main
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]"
      onPointerMove={handlePointerMove}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-50 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-current/35 bg-[rgba(255,250,240,0.58)] text-[9px] uppercase tracking-[0.22em] mix-blend-difference backdrop-blur-md lg:grid"
        style={{ x: cursorX, y: cursorY }}
      >
        <KayraMark className="absolute h-11 w-11 stroke-current opacity-30" />
        <span className="relative max-w-16 text-center leading-tight text-white">
          {cursorLabel}
        </span>
      </motion.div>

      <div
        ref={loaderRef}
        className="fixed inset-0 z-40 grid place-items-center bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)]"
      >
        <div className="relative grid place-items-center">
          <KayraMark className="h-36 w-36 stroke-[1.3] stroke-[var(--kayra-gold)] md:h-44 md:w-44" />
          <p className="mt-10 text-xs uppercase tracking-[0.7em]">KAYRA</p>
        </div>
      </div>

      <header className="pointer-events-none fixed left-0 right-0 top-0 z-20 flex items-center justify-between px-5 py-5 text-xs uppercase tracking-[0.52em] md:px-10">
        <span className="pointer-events-auto font-display text-lg tracking-[0.64em]">
          KAYRA
        </span>
        <nav className="pointer-events-auto hidden gap-8 text-[10px] tracking-[0.34em] md:flex">
          <Link className="magnetic-focus" href="/search">
            Search
          </Link>
          <Link className="magnetic-focus" href="/cart">
            Bag
          </Link>
        </nav>
      </header>

      <section className="grid min-h-screen snap-y snap-mandatory lg:flex">
        <WorldPanel
          activeWorld={activeWorld}
          id="clothing"
          isLeaving={isLeaving}
          onEnter={() => setWorld("clothing")}
          onLeave={() => setWorld(null)}
          onSelect={() => setIsLeaving(true)}
        />
        <WorldPanel
          activeWorld={activeWorld}
          id="jewelry"
          isLeaving={isLeaving}
          onEnter={() => setWorld("jewelry")}
          onLeave={() => setWorld(null)}
          onSelect={() => setIsLeaving(true)}
        />
      </section>
    </main>
  );
}

function WorldPanel({
  activeWorld,
  id,
  isLeaving,
  onEnter,
  onLeave,
  onSelect
}: {
  activeWorld: World | null;
  id: World;
  isLeaving: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onSelect: () => void;
}) {
  const panelRef = useRef<HTMLElement | null>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const driftX = useTransform(mouseX, [0, 1], [-18, 18]);
  const driftY = useTransform(mouseY, [0, 1], [-14, 14]);
  const isClothing = id === "clothing";
  const isActive = activeWorld === id;
  const isOtherActive = activeWorld !== null && !isActive;
  const widthClass = isActive
    ? "lg:basis-[60%]"
    : isOtherActive
      ? "lg:basis-[40%]"
      : "lg:basis-1/2";
  const data = worlds[id];

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    mouseX.set((event.clientX - bounds.left) / bounds.width);
    mouseY.set((event.clientY - bounds.top) / bounds.height);
  };

  useEffect(() => {
    const panel = panelRef.current;

    if (!panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const accent = panel.querySelector("[data-accent]");
    const copy = panel.querySelectorAll("[data-reveal]");

    const ctx = gsap.context(() => {
      gsap.to(accent, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: panel,
          scrub: true,
          start: "top bottom",
          end: "bottom top"
        }
      });
      gsap.fromTo(
        copy,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          scrollTrigger: {
            trigger: panel,
            start: "top 65%"
          }
        }
      );
    }, panel);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={panelRef}
      className={`${widthClass} group relative flex min-h-screen snap-start items-end overflow-hidden transition-[flex-basis,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-h-screen ${
        isOtherActive ? "brightness-[0.72]" : "brightness-100"
      }`}
      data-panel
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onPointerMove={onPointerMove}
    >
      <motion.div
        aria-hidden="true"
        className={`absolute inset-0 ${
          isClothing ? "kayra-clothing-visual" : "kayra-jewelry-visual"
        }`}
        style={{ x: driftX, y: driftY, scale: isActive ? 1.045 : 1.015 }}
        transition={{ duration: 0.7 }}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 ${
          isClothing
            ? "bg-[linear-gradient(90deg,rgba(255,250,240,0.82),rgba(255,250,240,0.18)_58%,rgba(59,36,28,0.16))]"
            : "bg-[linear-gradient(90deg,rgba(10,8,7,0.24),rgba(10,8,7,0.72)_42%,rgba(10,8,7,0.92))]"
        }`}
      />
      <motion.div
        aria-hidden="true"
        className={`absolute ${
          isClothing
            ? "left-[10%] top-[13%] text-[var(--kayra-walnut)]/10"
            : "right-[6%] top-[10%] text-[var(--jewel-champagne)]/10"
        }`}
        data-accent
        style={{ x: driftX, y: driftY }}
      >
        <KayraMark className="h-[38vh] w-[30vh] stroke-current stroke-[0.45]" />
      </motion.div>

      <div className="relative z-10 w-full px-6 pb-12 pt-28 md:px-12 md:pb-16 lg:px-14">
        <p
          className={`mb-6 text-[10px] uppercase tracking-[0.58em] ${
            isClothing ? "text-[var(--kayra-clay)]" : "text-[var(--jewel-champagne)]"
          }`}
          data-reveal
        >
          {data.eyebrow}
        </p>
        <h1
          className={`font-display text-6xl uppercase leading-[0.92] tracking-[0.18em] md:text-8xl xl:text-[7.6rem] ${
            isClothing ? "text-[var(--kayra-walnut)]" : "text-[var(--jewel-pearl)]"
          }`}
          data-reveal
        >
          {data.title}
        </h1>
        <p
          className={`mt-4 font-display text-xl uppercase tracking-[0.32em] md:text-3xl ${
            isClothing ? "text-[var(--kayra-clay)]" : "text-[var(--jewel-champagne)]"
          }`}
          data-reveal
        >
          ({data.parenthetical})
        </p>
        <p
          className={`mt-7 max-w-sm text-sm uppercase leading-7 tracking-[0.24em] ${
            isClothing ? "text-[var(--kayra-walnut)]/72" : "text-[var(--jewel-pearl)]/68"
          }`}
          data-reveal
        >
          {data.note}
        </p>
        <Link
          className={`magnetic-focus mt-10 inline-flex h-14 items-center gap-4 border px-6 text-[11px] uppercase tracking-[0.34em] transition duration-500 ${
            isClothing
              ? "border-[var(--kayra-walnut)]/30 bg-[var(--kayra-ivory)]/35 text-[var(--kayra-walnut)] hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
              : "border-[var(--jewel-champagne)]/35 bg-[var(--jewel-black)]/28 text-[var(--jewel-pearl)] hover:bg-[var(--jewel-champagne)] hover:text-[var(--jewel-black)]"
          }`}
          data-reveal
          href={data.href}
          onClick={onSelect}
          style={{
            opacity: isLeaving && !isActive ? 0.4 : 1
          }}
        >
          {data.action}
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.4} />
        </Link>
      </div>
    </section>
  );
}
