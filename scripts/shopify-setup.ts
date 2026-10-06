// Shopify setup for the KAYRA storefront:  npm run shopify:setup
//
// Creates the content sections the website reads (Shopify admin → Content →
// Metaobjects), as described in lib/shop/cms.ts: Announcement bar, Contact &
// WhatsApp, Social media links, Footer, Homepage, Homepage slider, Shop page,
// Jewelry page, About page (+ values), Lookbook page (+ chapters), Size guide
// and Google search. Each is filled with the current website text.
//
// Safe to run again: it renames/adds fields to match cms.ts but never changes
// entries that already exist. Values from the older "Site settings",
// "Content block" and "Hero slide" definitions are copied across, saved to
// scripts/backups/, and those old definitions are then removed.
//
// Needs an Admin API credential with the write_metaobject_definitions and
// write_metaobjects scopes, in .env.local:
//   SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
//   SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_…            (custom app token)
// or, for an app made in the Shopify Dev Dashboard:
//   SHOPIFY_ADMIN_CLIENT_ID=…  SHOPIFY_ADMIN_CLIENT_SECRET=…

import { mkdirSync, writeFileSync } from "node:fs";
import {
  cmsDefinitions,
  parseTarget,
  type CmsDefinition,
  type CmsField,
  type CmsFieldType
} from "../lib/shop/cms.ts";
import { defaultContentBlocks, defaultSettingsText } from "../lib/shop/content.ts";

const domain = (process.env.SHOPIFY_STORE_DOMAIN ?? "")
  .trim()
  .replace(/^https?:\/\//, "")
  .replace(/\/.*$/, "");
const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";

const shopifyTypes: Record<CmsFieldType, string> = {
  text: "single_line_text_field",
  longText: "multi_line_text_field",
  url: "url",
  image: "file_reference",
  images: "list.file_reference",
  collection: "collection_reference",
  collections: "list.collection_reference",
  number: "number_integer",
  textList: "list.single_line_text_field",
  boolean: "boolean"
};

const LEGACY_TYPES = ["site_settings", "content_block", "hero_slide"];

// ---------------------------------------------------------------------------
// Admin API
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

type ExistingDefinition = {
  id: string;
  fieldDefinitions: { key: string; type: { name: string } }[];
};

async function getDefinition(type: string): Promise<ExistingDefinition | null> {
  const data = await admin<{ metaobjectDefinitionByType: ExistingDefinition | null }>(
    `query ($type: String!) {
      metaobjectDefinitionByType(type: $type) {
        id
        fieldDefinitions { key type { name } }
      }
    }`,
    { type }
  );
  return data.metaobjectDefinitionByType;
}

type Entry = { handle: string; fields: { key: string; value: string | null }[] };

async function getEntries(type: string): Promise<Entry[]> {
  const data = await admin<{ metaobjects: { nodes: Entry[] } }>(
    `query ($type: String!) {
      metaobjects(type: $type, first: 250) {
        nodes { handle fields { key value } }
      }
    }`,
    { type }
  );
  return data.metaobjects.nodes;
}

// ---------------------------------------------------------------------------
// Definitions
// ---------------------------------------------------------------------------

const fieldInput = (field: CmsField) => ({
  key: field.key,
  name: field.name,
  description: field.help ?? "",
  type: shopifyTypes[field.type],
  ...(field.type === "image" || field.type === "images"
    ? { validations: [{ name: "file_type_options", value: JSON.stringify(["Image"]) }] }
    : {})
});

async function ensureDefinition(definition: CmsDefinition) {
  const existing = await getDefinition(definition.type);

  if (!existing) {
    const { metaobjectDefinitionCreate } = await admin<{ metaobjectDefinitionCreate: UserErrors }>(
      `mutation ($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) { userErrors { field message } }
      }`,
      {
        definition: {
          type: definition.type,
          name: definition.name,
          description: definition.help,
          displayNameKey: definition.displayField,
          access: { storefront: "PUBLIC_READ" },
          fieldDefinitions: definition.fields.map(fieldInput)
        }
      }
    );
    check(`Creating ${definition.name}`, metaobjectDefinitionCreate);
    console.log(`✓ Created  ${definition.name}`);
    return;
  }

  // Keep names, help texts and field order in sync with cms.ts.
  const have = new Map(existing.fieldDefinitions.map((field) => [field.key, field.type.name]));
  for (const field of definition.fields) {
    const type = have.get(field.key);
    if (type && type !== shopifyTypes[field.type]) {
      console.warn(`  ! ${definition.type}.${field.key} is "${type}", expected "${shopifyTypes[field.type]}"`);
    }
  }
  const { metaobjectDefinitionUpdate } = await admin<{ metaobjectDefinitionUpdate: UserErrors }>(
    `mutation ($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
      metaobjectDefinitionUpdate(id: $id, definition: $definition) { userErrors { field message } }
    }`,
    {
      id: existing.id,
      definition: {
        name: definition.name,
        description: definition.help,
        displayNameKey: definition.displayField,
        access: { storefront: "PUBLIC_READ" },
        fieldDefinitions: definition.fields.map((field) =>
          have.has(field.key)
            ? { update: { key: field.key, name: field.name, description: field.help ?? "" } }
            : { create: fieldInput(field) }
        ),
        resetFieldOrder: true
      }
    }
  );
  check(`Updating ${definition.name}`, metaobjectDefinitionUpdate);
  const added = definition.fields.filter((field) => !have.has(field.key));
  console.log(
    `✓ Updated  ${definition.name}` +
      (added.length ? ` (added ${added.map((field) => field.key).join(", ")})` : "")
  );
}

// ---------------------------------------------------------------------------
// Starter values: website defaults, overridden by the old definitions' values
// ---------------------------------------------------------------------------

type Values = Record<string, string>;
/** type → entry handle → field key → value */
const plan = new Map<string, Map<string, Values>>();

const planEntry = (type: string, handle: string): Values => {
  const entries = plan.get(type) ?? new Map<string, Values>();
  plan.set(type, entries);
  const values = entries.get(handle) ?? {};
  entries.set(handle, values);
  return values;
};

const REFERENCE_TYPES: CmsFieldType[] = ["image", "images", "collection", "collections"];

const defaultFor = (field: CmsField, listKey?: string): string => {
  if (REFERENCE_TYPES.includes(field.type)) {
    return "";
  }
  const target = parseTarget(field.to);
  let value: unknown;
  if (target.kind === "block") {
    value = defaultContentBlocks[target.block]?.[target.prop as keyof (typeof defaultContentBlocks)[string]];
  } else if (target.kind === "item" && listKey) {
    value = defaultContentBlocks[listKey]?.[target.prop as keyof (typeof defaultContentBlocks)[string]];
  } else if (target.kind === "settings") {
    value = (defaultSettingsText as Record<string, unknown>)[target.prop];
  }
  if (Array.isArray(value)) {
    return field.type === "textList" ? JSON.stringify(value) : "";
  }
  return value === undefined || value === null ? "" : String(value);
};

function planDefaults() {
  for (const definition of cmsDefinitions) {
    if (definition.list) {
      const keys = Object.keys(defaultContentBlocks).filter((key) =>
        key.startsWith(`${definition.list}-`)
      );
      for (const key of keys) {
        const values = planEntry(definition.type, key);
        for (const field of definition.fields) {
          values[field.key] = defaultFor(field, key);
        }
      }
    } else if (definition.entry) {
      const values = planEntry(definition.type, definition.entry);
      for (const field of definition.fields) {
        values[field.key] = defaultFor(field);
      }
    }
  }
}

/** The single-entry field whose `to` is `target`. */
const fieldFor = (target: string) => {
  for (const definition of cmsDefinitions) {
    if (definition.list || !definition.entry) {
      continue;
    }
    const field = definition.fields.find((entry) => entry.to === target);
    if (field) {
      return { definition, field };
    }
  }
  return null;
};

/** Converts an old value to the new field's type (list of images → one image). */
const convert = (value: string, type: CmsFieldType): string => {
  if (type === "image" || type === "collection") {
    if (value.startsWith("[")) {
      try {
        return String((JSON.parse(value) as string[])[0] ?? "");
      } catch {
        return "";
      }
    }
  }
  return value;
};

const setTarget = (target: string, value: string | null) => {
  if (!value) {
    return;
  }
  const match = fieldFor(target);
  if (!match) {
    return;
  }
  planEntry(match.definition.type, match.definition.entry!)[match.field.key] = convert(
    value,
    match.field.type
  );
};

const LEGACY_SETTINGS: Record<string, string> = {
  tagline: "settings.tagline",
  footer_note: "settings.footerNote",
  contact_email: "settings.contactEmail",
  contact_phone: "settings.contactPhone",
  whatsapp_number: "settings.whatsappNumber",
  address: "settings.address",
  business_hours: "settings.businessHours",
  instagram_handle: "settings.instagramHandle",
  instagram_url: "settings.social.Instagram",
  facebook_url: "settings.social.Facebook",
  tiktok_url: "settings.social.TikTok",
  youtube_url: "settings.social.YouTube",
  pinterest_url: "settings.social.Pinterest",
  x_url: "settings.social.X",
  snapchat_url: "settings.social.Snapchat",
  instagram_images: "settings.instagramImages",
  featured_collections: "settings.featuredCollections",
  trending_collection: "settings.trendingCollection",
  seo_title: "settings.seoTitle",
  seo_description: "settings.seoDescription"
};

const LEGACY_BLOCK_PROPS: Record<string, string> = {
  eyebrow: "eyebrow",
  title: "title",
  subtitle: "subtitle",
  body: "body",
  images: "images",
  cta_label: "ctaLabel",
  cta_link: "ctaLink",
  collection: "collection",
  position: "position"
};

const LEGACY_SLIDE_FIELDS: Record<string, string> = {
  image: "picture",
  eyebrow: "small_text",
  title: "title",
  cta_label: "button_text",
  link: "button_link",
  position: "order"
};

const valueMap = (entry: Entry) =>
  Object.fromEntries(entry.fields.map((field) => [field.key, field.value]));

async function planLegacy(): Promise<Record<string, Entry[]>> {
  const legacy: Record<string, Entry[]> = {};
  for (const type of LEGACY_TYPES) {
    if (await getDefinition(type)) {
      legacy[type] = await getEntries(type);
    }
  }

  const settings = legacy.site_settings?.[0];
  if (settings) {
    const values = valueMap(settings);
    const messages = [values.announcement, values.announcement_secondary].filter(
      (message): message is string => Boolean(message?.trim())
    );
    if (messages.length) {
      setTarget("settings.announcements", JSON.stringify(messages));
    }
    for (const [key, target] of Object.entries(LEGACY_SETTINGS)) {
      setTarget(target, values[key] ?? null);
    }
  }

  for (const entry of legacy.content_block ?? []) {
    const values = valueMap(entry);
    const placement = values.placement || entry.handle;
    const list = cmsDefinitions.find(
      (definition) => definition.list && placement.startsWith(`${definition.list}-`)
    );
    for (const [key, prop] of Object.entries(LEGACY_BLOCK_PROPS)) {
      const value = values[key];
      if (!value) {
        continue;
      }
      if (list) {
        const field = list.fields.find((entryField) => entryField.to === `item.${prop}`);
        if (field) {
          planEntry(list.type, placement)[field.key] = convert(value, field.type);
        }
      } else {
        setTarget(`${placement}.${prop}`, value);
      }
    }
  }

  for (const entry of legacy.hero_slide ?? []) {
    const values = valueMap(entry);
    const slide = planEntry("homepage_slide", entry.handle);
    for (const [oldKey, newKey] of Object.entries(LEGACY_SLIDE_FIELDS)) {
      if (values[oldKey]) {
        slide[newKey] = values[oldKey]!;
      }
    }
  }

  return legacy;
}

// ---------------------------------------------------------------------------
// Entries
// ---------------------------------------------------------------------------

async function createEntries(definition: CmsDefinition) {
  if ((await getEntries(definition.type)).length) {
    console.log(`  ${definition.name}: already has entries, left as they are`);
    return;
  }
  const entries = plan.get(definition.type) ?? new Map<string, Values>();
  for (const [handle, values] of entries) {
    const { metaobjectCreate } = await admin<{ metaobjectCreate: UserErrors }>(
      `mutation ($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) { userErrors { field message } }
      }`,
      {
        metaobject: {
          type: definition.type,
          handle,
          fields: Object.entries(values)
            .filter(([, value]) => value !== "")
            .map(([key, value]) => ({ key, value }))
        }
      }
    );
    check(`Filling ${definition.name}`, metaobjectCreate);
  }
  if (entries.size) {
    console.log(`  ${definition.name}: filled in (${entries.size} ${entries.size === 1 ? "entry" : "entries"})`);
  }
}

async function removeLegacy(legacy: Record<string, Entry[]>) {
  const types = Object.keys(legacy);
  if (!types.length) {
    return;
  }
  mkdirSync("scripts/backups", { recursive: true });
  const file = `scripts/backups/shopify-content-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
  writeFileSync(file, JSON.stringify(legacy, null, 2));
  console.log(`\nSaved the old entries to ${file}`);

  for (const type of types) {
    const definition = await getDefinition(type);
    if (!definition) {
      continue;
    }
    const { metaobjectDefinitionDelete } = await admin<{ metaobjectDefinitionDelete: UserErrors }>(
      `mutation ($id: ID!) {
        metaobjectDefinitionDelete(id: $id) { deletedId userErrors { field message } }
      }`,
      { id: definition.id }
    );
    check(`Removing old ${type}`, metaobjectDefinitionDelete);
    console.log(`✓ Removed the old "${type}" section (its values were copied across)`);
  }
}

async function main() {
  if (!domain) {
    throw new Error("Set SHOPIFY_STORE_DOMAIN (your-store.myshopify.com) in .env.local.");
  }
  accessToken = await getAccessToken();
  console.log(`Setting up ${domain}…\n`);

  planDefaults();
  const legacy = await planLegacy();

  for (const definition of cmsDefinitions) {
    await ensureDefinition(definition);
  }
  console.log("");
  for (const definition of cmsDefinitions) {
    await createEntries(definition);
  }
  await removeLegacy(legacy);

  console.log("\nDone. Edit everything in Shopify admin → Content → Metaobjects.");
}

main().catch((error: unknown) => {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
