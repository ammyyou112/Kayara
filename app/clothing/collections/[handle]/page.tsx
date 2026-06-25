import type { Metadata } from "next";
import { shop } from "@/lib/shop";
import { CollectionView } from "@/components/shop/CollectionView";

export async function generateMetadata({
  params
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await shop.getCollection(handle);
  return { title: collection?.title ?? "Collection" };
}

export default async function ClothingCollectionPage({
  params
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return <CollectionView handle={handle} world="clothing" />;
}
