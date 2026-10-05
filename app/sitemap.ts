import type { MetadataRoute } from "next";
import { shop } from "@/lib/shop";
import { collectionHref, productHref } from "@/lib/format";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")).replace(/\/$/, "");

  const [products, collections] = await Promise.all([
    shop.getProducts().catch(() => []),
    shop.getCollections().catch(() => [])
  ]);

  const staticPaths = ["/", "/shop", "/jewelry", "/lookbook", "/about"];

  return [
    ...staticPaths.map((path) => ({ url: `${base}${path}` })),
    ...collections.map((collection) => ({
      url: `${base}${collectionHref(collection.world, collection.handle)}`
    })),
    ...products.map((product) => ({ url: `${base}${productHref(product.world, product.handle)}` }))
  ];
}
