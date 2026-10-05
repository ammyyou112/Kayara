import { notFound, permanentRedirect } from "next/navigation";
import { shop } from "@/lib/shop";
import { productHref } from "@/lib/format";

// Shopify-style /products/[handle] links resolve to the storefront route.
export default async function ProductRedirect({
  params
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await shop.getProduct(handle);
  if (!product) {
    notFound();
  }
  permanentRedirect(productHref(product.world, product.handle));
}
