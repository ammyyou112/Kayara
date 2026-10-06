// One-time Shopify setup for the KAYRA storefront:  npm run shopify:setup
//
// Creates (or completes) the metaobject definitions the site reads —
// site_settings, hero_slide and content_block — with Storefront access turned
// on, then adds a starter entry for every editable section with the current
// website text, so it can be edited straight away in Shopify admin → Content →
// Metaobjects. Safe to run again: existing fields and entries are never changed.
//
// Needs an Admin API credential with the write_metaobject_definitions and
// write_metaobjects scopes, in .env.local:
//   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
//   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_…            (custom app token)
// or, for an app made in the Shopify Dev Dashboard:
//   SHOPIFY_ADMIN_CLIENT_ID=…  SHOPIFY_ADMIN_CLIENT_SECRET=…

import { defaultContentBlocks } from "../lib/shop/content.ts";

const domain = (process.env.SHOPIFY_STORE_DOMAIN ?? "")
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "");
const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";

type FieldDefinition = {
  key: string;
  name: string;
  type: string;
  description?: string;
  required?: boolean;
  validations?: { name: string; value: string }[];
};

const image = [{ name: "file_type_options", value: JSON.stringify(["Image"]) }];
const text = (key: string, name: string, description?: string): FieldDefinition => ({
  key,
  name,
  type: "single_line_text_field",
  description
});
const longText = (key: string, name: string, description?: string): FieldDefinition => ({
  key,
  name,
  type: "multi_line_text_field",
  description
});
const url = (key: string, name: string, description?: string): FieldDefinition => ({
  key,
  name,
  type: "url",
  description
});

const definitions: {
  type: string;
  name: string;
  description: string;
  displayNameKey?: string;
  fields: FieldDefinition[];
}[] = [
  {
    type: "site_settings",
    name: "Site settings",
    description: "Announcement bar, contact details, social links and homepage picks. Keep one entry.",
    fields: [
      text("announcement", "Announcement", "Top bar text"),
      text("announcement_secondary", "Announcement (second line)", "Shown next to the announcement on larger screens"),
      longText("tagline", "Footer tagline"),
      text("footer_note", "Footer note", "e.g. Prices in PKR · Worldwide shipping"),
      text("contact_email", "Contact email"),
      text("contact_phone", "Contact phone"),
      text("whatsapp_number", "WhatsApp number", "With country code, e.g. +92 300 1234567. Shows the WhatsApp chat button"),
      longText("address", "Address"),
      longText("business_hours", "Business hours"),
      text("instagram_handle", "Instagram handle", "e.g. @kayra"),
      url("instagram_url", "Instagram URL"),
      url("facebook_url", "Facebook URL"),
      url("tiktok_url", "TikTok URL"),
      url("youtube_url", "YouTube URL"),
      url("pinterest_url", "Pinterest URL"),
      url("x_url", "X (Twitter) URL"),
      url("snapchat_url", "Snapchat URL"),
      url("whatsapp_url", "WhatsApp link", "Optional; the WhatsApp number above is enough"),
      {
        key: "instagram_images",
        name: "Instagram images",
        type: "list.file_reference",
        validations: image
      },
      {
        key: "featured_collections",
        name: "Homepage featured collections",
        type: "list.collection_reference"
      },
      {
        key: "trending_collection",
        name: "Homepage trending collection",
        type: "collection_reference"
      },
      text("seo_title", "SEO title", "Browser tab and Google title for the homepage"),
      longText("seo_description", "SEO description", "Google description for the homepage")
    ]
  },
  {
    type: "hero_slide",
    name: "Hero slide",
    description: "Homepage hero slider. One entry per slide.",
    displayNameKey: "title",
    fields: [
      { key: "image", name: "Image", type: "file_reference", validations: image },
      text("eyebrow", "Eyebrow", "Small line above the title"),
      text("title", "Title"),
      text("cta_label", "Button label"),
      text("link", "Link", "A path like /collections/bridal or a full URL"),
      { key: "position", name: "Position", type: "number_integer", description: "Lower numbers show first" }
    ]
  },
  {
    type: "content_block",
    name: "Content block",
    description:
      "Editable text and images for each section of the website. Placement says where it shows (see README).",
    displayNameKey: "placement",
    fields: [
      {
        ...text("placement", "Placement", "Where this shows, e.g. home-statement or lookbook-chapter-4. Don't change it on existing entries."),
        required: true
      },
      text("eyebrow", "Eyebrow", "Small line above the title"),
      text("title", "Title"),
      text("subtitle", "Subtitle"),
      longText("body", "Text", "Leave a blank line between paragraphs"),
      {
        key: "images",
        name: "Images",
        type: "list.file_reference",
        description: "The image alt text is used as the caption where captions show",
        validations: image
      },
      text("cta_label", "Button label"),
      text("cta_link", "Button link", "A path like /collections/bridal or a full URL"),
      { key: "collection", name: "Collection", type: "collection_reference" },
      { key: "position", name: "Position", type: "number_integer", description: "Order within a list, lower first" }
    ]
  }
];

const siteSettingsSeed: Record<string, string> = {
  announcement: "Complimentary shipping nationwide",
  tagline: "A cinematic South Asian luxury house — formal pret, bridal, and heirloom jewelry.",
  footer_note: "Prices in PKR · Worldwide shipping",
  instagram_handle: "@kayra"
};

// ---------------------------------------------------------------------------

async function getAccessToken(): Promise<string> {
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (token) {
    return token;
  }
  const clientId = process.env.SHOPIFY_ADMIN_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "Set SHOPIFY_ADMIN_ACCESS_TOKEN, or SHOPIFY_ADMIN_CLIENT_ID and SHOPIFY_ADMIN_CLIENT_SECRET, in .env.local."
    );
  }
  const response = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    })
  });
  const json = (await response.json().catch(() => ({}))) as { access_token?: string };
  if (!response.ok || !json.access_token) {
    throw new Error(
      `Could not get an Admin API token (${response.status}). Check the client ID/secret and that the app is installed on ${domain}.`
    );
  }
  return json.access_token;
}

let accessToken = "";

async function admin<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(`https://${domain}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": accessToken },
    body: JSON.stringify({ query, variables })
  });
  if (!response.ok) {
    throw new Error(`Admin API responded ${response.status} ${response.statusText}`);
  }
  const json = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(json.errors.map((error) => error.message).join("; "));
  }
  return json.data as T;
}

type UserErrors = { userErrors: { field: string[] | null; message: string }[] };

const check = (label: string, payload: UserErrors) => {
  if (payload.userErrors.length) {
    throw new Error(`${label}: ${payload.userErrors.map((error) => error.message).join("; ")}`);
  }
};

async function ensureDefinition(definition: (typeof definitions)[number]) {
  const { metaobjectDefinitionByType: existing } = await admin<{
    metaobjectDefinitionByType: {
      id: string;
      fieldDefinitions: { key: string }[];
      access: { storefront: string };
    } | null;
  }>(
    `query ($type: String!) {
      metaobjectDefinitionByType(type: $type) {
        id
        fieldDefinitions { key }
        access { storefront }
      }
    }`,
    { type: definition.type }
  );

  if (!existing) {
    const { metaobjectDefinitionCreate } = await admin<{ metaobjectDefinitionCreate: UserErrors }>(
      `mutation ($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          userErrors { field message }
        }
      }`,
      {
        definition: {
          type: definition.type,
          name: definition.name,
          description: definition.description,
          displayNameKey: definition.displayNameKey,
          access: { storefront: "PUBLIC_READ" },
          fieldDefinitions: definition.fields
        }
      }
    );
    check(`Creating ${definition.type}`, metaobjectDefinitionCreate);
    console.log(`✓ Created "${definition.name}" (${definition.type})`);
    return;
  }

  const have = new Set(existing.fieldDefinitions.map((field) => field.key));
  const missing = definition.fields.filter((field) => !have.has(field.key));
  const needsAccess = existing.access.storefront !== "PUBLIC_READ";
  if (!missing.length && !needsAccess) {
    console.log(`✓ "${definition.name}" (${definition.type}) already complete`);
    return;
  }

  const { metaobjectDefinitionUpdate } = await admin<{ metaobjectDefinitionUpdate: UserErrors }>(
    `mutation ($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
      metaobjectDefinitionUpdate(id: $id, definition: $definition) {
        userErrors { field message }
      }
    }`,
    {
      id: existing.id,
      definition: {
        access: { storefront: "PUBLIC_READ" },
        fieldDefinitions: missing.map((field) => ({ create: field }))
      }
    }
  );
  check(`Updating ${definition.type}`, metaobjectDefinitionUpdate);
  console.log(
    `✓ Updated "${definition.name}" (${definition.type})` +
      (missing.length ? `: added ${missing.map((field) => field.key).join(", ")}` : "") +
      (needsAccess ? " · turned on Storefront access" : "")
  );
}

async function existingEntries(type: string): Promise<{ handle: string; placement: string | null }[]> {
  const data = await admin<{
    metaobjects: { nodes: { handle: string; placement: { value: string } | null }[] };
  }>(
    `query ($type: String!) {
      metaobjects(type: $type, first: 250) {
        nodes { handle placement: field(key: "placement") { value } }
      }
    }`,
    { type }
  );
  return data.metaobjects.nodes.map((node) => ({
    handle: node.handle,
    placement: node.placement?.value ?? null
  }));
}

async function createEntry(type: string, handle: string, fields: Record<string, string>) {
  const { metaobjectCreate } = await admin<{ metaobjectCreate: UserErrors }>(
    `mutation ($metaobject: MetaobjectCreateInput!) {
      metaobjectCreate(metaobject: $metaobject) {
        userErrors { field message }
      }
    }`,
    {
      metaobject: {
        type,
        handle,
        fields: Object.entries(fields)
          .filter(([, value]) => value !== "")
          .map(([key, value]) => ({ key, value }))
      }
    }
  );
  check(`Creating ${type} "${handle}"`, metaobjectCreate);
}

async function seed() {
  if (!(await existingEntries("site_settings")).length) {
    await createEntry("site_settings", "site-settings", siteSettingsSeed);
    console.log("✓ Added the Site settings entry");
  }

  const taken = new Set(
    (await existingEntries("content_block")).flatMap((entry) => [entry.handle, entry.placement])
  );
  let added = 0;
  for (const [placement, block] of Object.entries(defaultContentBlocks)) {
    if (taken.has(placement)) {
      continue;
    }
    // Images stay on the built-in photos until replaced in Shopify admin.
    await createEntry("content_block", placement, {
      placement,
      eyebrow: block.eyebrow ?? "",
      title: block.title ?? "",
      subtitle: block.subtitle ?? "",
      body: block.body ?? "",
      cta_label: block.ctaLabel ?? "",
      cta_link: block.ctaLink ?? "",
      position: block.position ? String(block.position) : ""
    });
    added += 1;
  }
  console.log(
    added ? `✓ Added ${added} content blocks` : "✓ All content blocks already exist"
  );
}

async function main() {
  if (!domain) {
    throw new Error("Set SHOPIFY_STORE_DOMAIN (your-store.myshopify.com) in .env.local.");
  }
  accessToken = await getAccessToken();
  console.log(`Setting up ${domain}…\n`);
  for (const definition of definitions) {
    await ensureDefinition(definition);
  }
  await seed();
  console.log("\nDone. Edit everything in Shopify admin → Content → Metaobjects.");
}

main().catch((error: unknown) => {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
