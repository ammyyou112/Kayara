import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { BrandLoader } from "@/components/site/BrandLoader";

export const metadata: Metadata = {
  title: {
    default: "KAYRA | Fashion & Jewelry",
    template: "%s | KAYRA"
  },
  description:
    "KAYRA is a cinematic South Asian luxury fashion and jewelry house.",
  openGraph: {
    title: "KAYRA | Fashion & Jewelry",
    description:
      "Editorial pret, bridal, wedding guest wear, and jewelry in a headless luxury storefront.",
    siteName: "KAYRA",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <BrandLoader />
        <LenisProvider />
        <CartProvider>
          <WishlistProvider>
            <RouteTransition>{children}</RouteTransition>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
