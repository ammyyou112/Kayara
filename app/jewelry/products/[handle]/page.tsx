import type { Metadata } from "next";
import { shop } from "@/lib/shop";
import { ProductView } from "@/components/shop/ProductView";

export async function generateMetadata({
  params
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await shop.getProduct(handle);
  if (!product) {
    return { title: "Product" };
  }
  const image = product.images[0];
  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description.slice(0, 160),
    openGraph: image ? { images: [{ url: image.url, alt: image.altText }] } : undefined
  };
}

export default async function JewelryProductPage({
  params
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return <ProductView handle={handle} world="jewelry" />;
}
