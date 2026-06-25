import Image from "next/image";

// Fills its (relative, sized) parent and covers it. Keeps next/image config in
// one place so every surface gets optimisation + lazy loading for free.
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
