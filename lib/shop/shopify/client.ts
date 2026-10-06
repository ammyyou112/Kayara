// Minimal Storefront API client. Server-only: the access token never reaches
// the browser because this module is only imported by server components,
// route handlers, and server actions.

const rawDomain = process.env.SHOPIFY_STORE_DOMAIN ?? "";

export const shopifyDomain = rawDomain
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "");

const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";
const publicToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? "";
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN ?? "";

/** Seconds a catalog/content response is cached before Next refetches it. */
const revalidateSeconds = Number(process.env.SHOPIFY_REVALIDATE_SECONDS ?? 60);

/** Cache tag the /api/revalidate webhook purges. */
export const SHOPIFY_CACHE_TAG = "shopify";

export const isShopifyConfigured = Boolean(shopifyDomain && (publicToken || privateToken));

export class ShopifyError extends Error {}

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
  { cache = "force-cache" }: { cache?: "force-cache" | "no-store" } = {}
): Promise<T> {
  if (!isShopifyConfigured) {
    throw new ShopifyError(
      "Shopify is not configured: set SHOPIFY_STORE_DOMAIN and a Storefront access token."
    );
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (privateToken) {
    headers["Shopify-Storefront-Private-Token"] = privateToken;
  } else {
    headers["X-Shopify-Storefront-Access-Token"] = publicToken;
  }

  const response = await fetch(`https://${shopifyDomain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(cache === "no-store"
      ? { cache: "no-store" as const }
      : { next: { revalidate: revalidateSeconds, tags: [SHOPIFY_CACHE_TAG] } })
  });

  if (!response.ok) {
    throw new ShopifyError(
      `Shopify Storefront API responded ${response.status} ${response.statusText}`
    );
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (json.errors?.length) {
    throw new ShopifyError(json.errors.map((error) => error.message).join("; "));
  }
  if (!json.data) {
    throw new ShopifyError("Shopify Storefront API returned no data.");
  }
  return json.data;
}
