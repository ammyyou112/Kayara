import Image from "next/image";

// Fills its (relative, sized) parent and covers it. Keeps next/image config in
// one place so every surface gets responsive sizes + lazy loading for free.
// Renders a quiet placeholder when Shopify has no image for the item.
export function Media({
  src,
  alt,
  sizes = "100vw",
  priority = false,
  className = ""
}: {
  src: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        aria-label={alt || undefined}
        className={`absolute inset-0 grid place-items-center bg-[var(--kayra-ivory)] font-display text-sm tracking-[0.4em] text-[var(--kayra-walnut)]/25 ${className}`}
        role={alt ? "img" : undefined}
      >
        KAYRA
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={`object-cover ${className}`}
      fill
      priority={priority}
      sizes={sizes}
      src={src}
    />
  );
}
