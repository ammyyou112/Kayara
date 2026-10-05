import { ArrowUpRight } from "lucide-react";
import { Media } from "@/components/site/Media";
import type { Image } from "@/lib/shop/types";

// Images, handle and profile link come from the site_settings metaobject.
export function InstagramGallery({
  images,
  handle,
  url
}: {
  images: Image[];
  handle: string;
  url: string;
}) {
  if (!images.length) {
    return null;
  }

  const Tile = url ? "a" : "div";

  return (
    <section className="px-5 py-16 md:px-8 md:py-24 xl:px-12">
      <div className="mb-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] text-[var(--kayra-clay)]">
          Follow the House
        </p>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.16em] md:text-6xl md:tracking-[0.2em]">
          {handle}
        </h2>
        {url ? (
          <a
            className="magnetic-focus mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] transition hover:opacity-60"
            href={url}
            rel="noreferrer"
            target="_blank"
          >
            Follow on Instagram
            <ArrowUpRight size={15} strokeWidth={1.4} />
          </a>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {images.slice(0, 6).map((image, i) => (
          <Tile
            className="group relative aspect-square overflow-hidden"
            key={image.url + i}
            {...(url ? { href: url, rel: "noreferrer", target: "_blank" } : {})}
          >
            <Media
              alt={image.altText}
              className="transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
              src={image.url}
            />
            {url ? (
              <div className="absolute inset-0 grid place-items-center bg-[rgba(9,7,6,0)] opacity-0 transition-all duration-500 group-hover:bg-[rgba(9,7,6,0.45)] group-hover:opacity-100">
                <ArrowUpRight className="text-[var(--kayra-ivory)]" size={22} strokeWidth={1.3} />
              </div>
            ) : null}
          </Tile>
        ))}
      </div>
    </section>
  );
}
