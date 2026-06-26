import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/site/Media";
import { unsplash } from "@/lib/images";

const shots = [
  unsplash("1502716119720-b23a93e5fe1b", 800),
  unsplash("1612817159949-195b6eb9e31a", 800),
  unsplash("1573408301185-9146fe634ad0", 800),
  unsplash("1617038220319-276d3cfab638", 800),
  unsplash("1515377905703-c4788e51af15", 800),
  unsplash("1556905055-8f358a7a47b2", 800)
];

export function InstagramGallery() {
  return (
    <section className="px-5 py-16 md:px-12 md:py-24">
      <div className="mb-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
          Follow the House
        </p>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.2em] md:text-6xl">
          @kayra
        </h2>
        <Link
          className="magnetic-focus mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] transition hover:opacity-60"
          href="#"
        >
          Follow on Instagram
          <ArrowUpRight size={15} strokeWidth={1.4} />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {shots.map((src, i) => (
          <Link
            className="group relative aspect-square overflow-hidden"
            href="/lookbook"
            key={src}
          >
            <Media
              alt={`KAYRA on Instagram ${i + 1}`}
              className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              src={src}
            />
            <div className="absolute inset-0 grid place-items-center bg-[rgba(9,7,6,0)] opacity-0 transition-all duration-500 group-hover:bg-[rgba(9,7,6,0.45)] group-hover:opacity-100">
              <ArrowUpRight
                className="text-[var(--kayra-ivory)]"
                size={22}
                strokeWidth={1.3}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
