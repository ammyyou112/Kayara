import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { shop } from "@/lib/shop";
import { RichPage } from "@/components/site/RichPage";

// Store policies from Shopify admin → Settings → Policies:
// /policies/shipping-policy, refund-policy, privacy-policy, terms-of-service.
export async function generateMetadata({
  params
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const policy = await shop.getPolicy(handle);
  return { title: policy?.title ?? "Policy" };
}

export default async function PolicyPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const policy = await shop.getPolicy(handle);
  if (!policy) {
    notFound();
  }
  return <RichPage eyebrow="Client Care" page={policy} />;
}
