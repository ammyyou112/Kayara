import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Shopify's and Unsplash's CDNs resize on the fly; the custom loader just
    // requests the right width for each srcset entry.
    loader: "custom",
    loaderFile: "./lib/image-loader.ts"
  },
  async redirects() {
    return [
      // The home page is the clothing storefront.
      { source: "/clothing", destination: "/", permanent: false },
      // Shopify-style URLs (from rich text, emails, old links) → storefront routes.
      { source: "/collections/all", destination: "/shop", permanent: true },
      { source: "/collections", destination: "/shop", permanent: true },
      { source: "/products", destination: "/shop", permanent: true }
    ];
  }
};

export default nextConfig;
