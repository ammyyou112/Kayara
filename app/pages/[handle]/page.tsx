import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { shop } from "@/lib/shop";
import { RichPage } from "@/components/site/RichPage";

// Any page created in Shopify admin → Online Store → Pages is served here.
export async function generateMetadata({
  params
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const page = await shop.getPage(handle);
  return {
    title: page?.seo?.title || page?.title || "Page",
    description: page?.seo?.description
  };
}

export default async function ShopifyPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const [page, settings] = await Promise.all([shop.getPage(handle), shop.getSiteSettings()]);
  if (!page) {
    notFound();
  }
  return (
    <RichPage
      contact={handle === "contact" ? settings : undefined}
      eyebrow="The House"
      page={page}
    />
  );
}
