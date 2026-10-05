import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { SHOPIFY_CACHE_TAG } from "@/lib/shop/shopify/client";

// Shopify webhooks (products/*, collections/*, inventory_levels/update …) POST
// here so admin edits appear on the storefront within seconds instead of
// waiting for the time-based cache (SHOPIFY_REVALIDATE_SECONDS).
//
// The webhook body is signed with the app's client secret; set it as
// SHOPIFY_WEBHOOK_SECRET. For a manual refresh: POST /api/revalidate?secret=…
// with REVALIDATE_SECRET.

const verifyShopifySignature = (body: string, signature: string | null): boolean => {
  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret || !signature) {
    return false;
  }
  const digest = createHmac("sha256", secret).update(body, "utf8").digest();
  const provided = Buffer.from(signature, "base64");
  return provided.length === digest.length && timingSafeEqual(provided, digest);
};

export async function POST(request: NextRequest) {
  const body = await request.text();
  const manualSecret = process.env.REVALIDATE_SECRET;
  const manual =
    Boolean(manualSecret) && request.nextUrl.searchParams.get("secret") === manualSecret;

  if (!manual && !verifyShopifySignature(body, request.headers.get("x-shopify-hmac-sha256"))) {
    return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
  }

  revalidateTag(SHOPIFY_CACHE_TAG);
  revalidatePath("/", "layout");

  return NextResponse.json({
    ok: true,
    topic: request.headers.get("x-shopify-topic") ?? "manual",
    revalidatedAt: new Date().toISOString()
  });
}
