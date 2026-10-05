"use server";

import { shop } from "@/lib/shop";
import { shopifyDomain } from "@/lib/shop/shopify/client";

export type NewsletterResult = { ok: true } | { ok: false; message: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Storefront API cannot subscribe an email without creating a password-protected
// account, so signups go through the Admin API (needs SHOPIFY_ADMIN_ACCESS_TOKEN
// with the write_customers scope). Subscribers then appear in Shopify admin →
// Customers with "Subscribed" email marketing status, ready for Shopify Email.
export async function subscribeAction(email: string): Promise<NewsletterResult> {
  const address = email.trim().toLowerCase();
  if (!EMAIL.test(address)) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!adminToken) {
    if (shop.name === "mock") {
      return { ok: true };
    }
    console.error("[newsletter] SHOPIFY_ADMIN_ACCESS_TOKEN is not set; signup dropped.");
    return { ok: false, message: "Signups are temporarily unavailable." };
  }

  const version = process.env.SHOPIFY_API_VERSION || "2026-07";
  try {
    const response = await fetch(`https://${shopifyDomain}/admin/api/${version}/graphql.json`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": adminToken
      },
      body: JSON.stringify({
        query: `mutation Subscribe($input: CustomerInput!) {
          customerCreate(input: $input) { userErrors { field message } }
        }`,
        variables: {
          input: {
            email: address,
            tags: ["newsletter", "headless-storefront"],
            emailMarketingConsent: {
              marketingState: "SUBSCRIBED",
              marketingOptInLevel: "SINGLE_OPT_IN"
            }
          }
        }
      })
    });
    const json = (await response.json()) as {
      data?: { customerCreate: { userErrors: { message: string }[] } };
      errors?: unknown;
    };
    const errors = json.data?.customerCreate.userErrors ?? [];
    // An existing customer is fine — they're already on the list or can opt in at checkout.
    if (!response.ok || json.errors || errors.some((error) => !/taken/i.test(error.message))) {
      console.error("[newsletter] Shopify rejected signup", json.errors ?? errors);
      return { ok: false, message: "Something went wrong. Please try again." };
    }
    return { ok: true };
  } catch (error) {
    console.error("[newsletter] request failed", error);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
