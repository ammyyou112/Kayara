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
  if (!collection) {
    return { title: "Collection" };
  }
  return {
    title: collection.seo?.title || collection.title,
    description: collection.seo?.description || collection.description || undefined,
    openGraph: collection.heroImage
      ? { images: [{ url: collection.heroImage.url, alt: collection.heroImage.altText }] }
      : undefined
  };
}

export default async function ClothingCollectionPage({
  params
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  return <CollectionView handle={handle} world="clothing" />;
}
