import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000")).replace(/\/$/, "");

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/cart", "/checkout", "/wishlist", "/api/"] },
    sitemap: `${base}/sitemap.xml`
  };
}
