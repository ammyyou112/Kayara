"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[60vh] place-items-center px-5 py-20 text-center">
      <div>
        <h1 className="font-display text-4xl uppercase tracking-[0.18em] md:text-5xl">
          Something went wrong
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm uppercase leading-7 tracking-[0.2em] text-[var(--kayra-walnut)]/60">
          We couldn&rsquo;t load this page. Please try again in a moment.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <button
            className="magnetic-focus inline-flex h-12 items-center bg-[var(--kayra-walnut)] px-7 text-[11px] uppercase tracking-[0.3em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
            onClick={reset}
            type="button"
          >
            Try again
          </button>
          <Link
            className="magnetic-focus inline-flex h-12 items-center border border-[var(--kayra-walnut)]/30 px-7 text-[11px] uppercase tracking-[0.3em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
            href="/"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
