import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartToast } from "@/components/cart/CartToast";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { LenisProvider } from "@/components/motion/LenisProvider";
import { RouteTransition } from "@/components/motion/RouteTransition";
import { BrandLoader } from "@/components/site/BrandLoader";
import { introScript } from "@/lib/intro";
import { SiteNav } from "@/components/site/SiteNav";
import { SiteFooter } from "@/components/site/SiteFooter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KAYRA | Fashion & Jewelry",
    template: "%s | KAYRA"
  },
  description: "KAYRA is a cinematic South Asian luxury fashion and jewelry house.",
  openGraph: {
    title: "KAYRA | Fashion & Jewelry",
    description:
      "Editorial pret, bridal, wedding guest wear, and jewelry from the house of KAYRA.",
    siteName: "KAYRA",
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#f5efe4"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="bg-[var(--kayra-cream)] text-[var(--kayra-walnut)]">
        <a
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:bg-[var(--kayra-walnut)] focus:px-4 focus:py-2 focus:text-[11px] focus:uppercase focus:tracking-[0.2em] focus:text-[var(--kayra-ivory)]"
          href="#main"
        >
          Skip to content
        </a>
        <BrandLoader />
        <LenisProvider />
        <CartProvider>
          <WishlistProvider>
            <SiteNav />
            <CartToast />
            <RouteTransition>
              <div className="min-h-[60vh]" id="main">
                {children}
              </div>
            </RouteTransition>
            <SiteFooter />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
