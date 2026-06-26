"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const letters = "KAYRA".split("");

export function BrandLoader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDone(true), 2000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = done ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [done]);

  return (
    <AnimatePresence>
      {!done ? (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)]"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="text-center">
            <div className="flex justify-center">
              {letters.map((char, i) => (
                <span className="overflow-hidden px-[0.08em] md:px-[0.11em]" key={i}>
                  <motion.span
                    animate={{ y: "0%" }}
                    className="block font-display text-5xl uppercase leading-none md:text-7xl"
                    initial={{ y: "110%" }}
                    transition={{
                      delay: 0.15 + i * 0.07,
                      duration: 0.7,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
            </div>

            <motion.div
              animate={{ scaleX: 1 }}
              className="mx-auto mt-6 h-px w-40 origin-left bg-[var(--kayra-gold)] md:w-56"
              initial={{ scaleX: 0 }}
              transition={{ delay: 0.55, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.p
              animate={{ opacity: 1 }}
              className="mt-6 text-[10px] uppercase tracking-[0.5em] text-[var(--kayra-ivory)]/70"
              initial={{ opacity: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              Fashion &amp; Jewelry
            </motion.p>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
