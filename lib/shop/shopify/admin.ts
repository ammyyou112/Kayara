// Server-only Admin API access, used for newsletter signups. Works with a
// custom app token (SHOPIFY_ADMIN_ACCESS_TOKEN) or a Dev Dashboard app's
// client credentials (SHOPIFY_ADMIN_CLIENT_ID + SHOPIFY_ADMIN_CLIENT_SECRET).

import { shopifyDomain } from "./client";

let cached: { token: string; expiresAt: number } | null = null;

export const isAdminConfigured = Boolean(
  process.env.SHOPIFY_ADMIN_ACCESS_TOKEN ||
    (process.env.SHOPIFY_ADMIN_CLIENT_ID && process.env.SHOPIFY_ADMIN_CLIENT_SECRET)
);

export async function getAdminToken(): Promise<string> {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (token) {
    return token;
  }
  if (cached && cached.expiresAt > Date.now()) {
    return cached.token;
  }
  const response = await fetch(`https://${shopifyDomain}/admin/oauth/access_token`, {
    method: "POST",
    cache: "no-store",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.SHOPIFY_ADMIN_CLIENT_ID ?? "",
      client_secret: process.env.SHOPIFY_ADMIN_CLIENT_SECRET ?? ""
    })
  });
  const json = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!response.ok || !json.access_token) {
    throw new Error(`Admin token request failed (${response.status})`);
  }
  // Refresh a minute early.
  cached = {
    token: json.access_token,
    expiresAt: Date.now() + Math.max(60, (json.expires_in ?? 3600) - 60) * 1000
  };
  return cached.token;
}
