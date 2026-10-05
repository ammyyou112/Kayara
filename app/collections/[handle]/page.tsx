import { notFound, permanentRedirect } from "next/navigation";
import { shop } from "@/lib/shop";
import { collectionHref } from "@/lib/format";

// Shopify-style /collections/[handle] links resolve to the storefront route.
export default async function CollectionRedirect({
  params
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await shop.getCollection(handle);
  if (!collection) {
    notFound();
  }
  permanentRedirect(collectionHref(collection.world, collection.handle));
}
