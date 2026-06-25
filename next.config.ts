import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images are remote Unsplash/Shopify URLs already sized via CDN params, so
    // we skip Next's optimizer (which otherwise times out on large sources in
    // dev). Swap to false once self-hosted product photography is in place.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com"
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ]
  }
};

export default nextConfig;
