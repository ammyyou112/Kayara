// next/image loader that asks the source CDN for the exact width needed, so
// responsive srcsets work without routing images through Vercel's optimizer.
export default function imageLoader({
  src,
  width,
  quality
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  if (!/^https?:\/\//.test(src)) {
    return src;
  }
  const url = new URL(src);
  if (url.hostname === "cdn.shopify.com" || url.pathname.includes("/cdn/shop/")) {
    url.searchParams.set("width", String(width));
  } else if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 75));
    url.searchParams.set("auto", "format");
  }
  return url.toString();
}
