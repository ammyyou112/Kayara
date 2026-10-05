import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[60vh] place-items-center px-5 py-20 text-center">
      <div>
        <p className="text-[11px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">404</p>
        <h1 className="mt-5 font-display text-4xl uppercase tracking-[0.18em] md:text-6xl">
          Not Found
        </h1>
        <p className="mx-auto mt-5 max-w-md text-sm uppercase leading-7 tracking-[0.2em] text-[var(--kayra-walnut)]/60">
          This piece may have moved or is no longer available.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link
            className="magnetic-focus inline-flex h-12 items-center bg-[var(--kayra-walnut)] px-7 text-[11px] uppercase tracking-[0.3em] text-[var(--kayra-ivory)] transition hover:bg-[var(--kayra-clay)]"
            href="/shop"
          >
            Shop All
          </Link>
          <Link
            className="magnetic-focus inline-flex h-12 items-center border border-[var(--kayra-walnut)]/30 px-7 text-[11px] uppercase tracking-[0.3em] transition hover:bg-[var(--kayra-walnut)] hover:text-[var(--kayra-ivory)]"
            href="/search"
          >
            Search
          </Link>
        </div>
      </div>
    </main>
  );
}
