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
  return {
    title: product?.title ?? "Product",
    description: product?.description
  };
}

export default async function ClothingProductPage({
  params
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return <ProductView handle={handle} world="clothing" />;
}
