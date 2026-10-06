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
  cmsMetafields,
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
  boolean: "boolean",
  choice: "single_line_text_field",
  choices: "list.single_line_text_field",
  metaobject: "metaobject_reference"
};

// Older content definitions. Their values are copied into the new sections
// (where they map), backed up, and the definitions removed.
const LEGACY_TYPES = ["site_settings", "content_block", "hero_slide", "size_guide", "size_chart_row"];

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

/** Steps skipped because the app is missing an access scope. */
const missingScopes = new Set<string>();

/** Runs a step; an "Access denied" error just records the missing scope. */
async function optional<T>(label: string, scope: string, run: () => Promise<T>): Promise<T | null> {
  try {
    return await run();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (/access denied|ACCESS_DENIED|scope|cannot create a webhook subscription with the specified topic/i.test(message)) {
      missingScopes.add(scope);
      console.log(`  – skipped ${label} (the app needs the ${scope} permission)`);
      return null;
    }
    throw error;
  }
}

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

type Entry = { id: string; handle: string; fields: { key: string; value: string | null }[] };

async function getEntries(type: string): Promise<Entry[]> {
  const data = await admin<{ metaobjects: { nodes: Entry[] } }>(
    `query ($type: String!) {
      metaobjects(type: $type, first: 250) {
        nodes { id handle fields { key value } }
      }
    }`,
    { type }
  );
  return data.metaobjects.nodes;
}

/** Every product type used in the store, for the size chart dropdown. */
async function getProductTypes(): Promise<string[]> {
  const fromAdmin = await optional("reading product types", "read_products", async () => {
    const types = new Set<string>();
    let after: string | null = null;
    for (let page = 0; page < 20; page += 1) {
      const data: {
        products: { nodes: { productType: string }[]; pageInfo: { hasNextPage: boolean; endCursor: string } };
      } = await admin(
        `query ($after: String) {
          products(first: 250, after: $after) {
            nodes { productType }
            pageInfo { hasNextPage endCursor }
          }
        }`,
        { after }
      );
      data.products.nodes.forEach((product) => product.productType.trim() && types.add(product.productType.trim()));
      if (!data.products.pageInfo.hasNextPage) {
        break;
      }
      after = data.products.pageInfo.endCursor;
    }
    return [...types].sort();
  });
  if (fromAdmin) {
    if (!fromAdmin.length) {
      console.log("  (No product types yet. Set a Type on your products and run this again.)\n");
    }
    return fromAdmin;
  }

  const token =
    process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!token) {
    console.log(
      "  (No Storefront token in .env.local, so “Use for these product types” will be a text box\n" +
        "   instead of a dropdown. Add SHOPIFY_STOREFRONT_PRIVATE_TOKEN and run this again.)\n"
    );
    return [];
  }
  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN
        ? { "Shopify-Storefront-Private-Token": token }
        : { "X-Shopify-Storefront-Access-Token": token })
    },
    body: JSON.stringify({ query: "{ productTypes(first: 250) { edges { node } } }" })
  });
  const json = (await response.json().catch(() => ({}))) as {
    data?: { productTypes: { edges: { node: string }[] } };
  };
  const types = (json.data?.productTypes.edges ?? [])
    .map((edge) => edge.node.trim())
    .filter(Boolean);
  if (!types.length) {
    console.log("  (No product types found yet. Set a Type on your products and run this again.)\n");
  }
  return types;
}

// ---------------------------------------------------------------------------
// Definitions
// ---------------------------------------------------------------------------

let productTypes: string[] = [];

const validationsFor = async (field: CmsField) => {
  if (field.type === "image" || field.type === "images") {
    return [{ name: "file_type_options", value: JSON.stringify(["Image"]) }];
  }
  if (field.type === "choice" || field.type === "choices") {
    const choices = field.choicesFrom === "productTypes" ? productTypes : (field.choices ?? []);
    return choices.length ? [{ name: "choices", value: JSON.stringify(choices) }] : [];
  }
  if (field.type === "metaobject" && field.refType) {
    const target = await getDefinition(field.refType);
    if (!target) {
      throw new Error(`${field.key} points to "${field.refType}", which does not exist yet`);
    }
    return [{ name: "metaobject_definition_id", value: target.id }];
  }
  return [];
};

const fieldInput = async (field: CmsField) => ({
  key: field.key,
  name: field.name,
  description: field.help ?? "",
  type: shopifyTypes[field.type],
  validations: await validationsFor(field)
});

async function ensureDefinition(definition: CmsDefinition): Promise<string[]> {
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
          fieldDefinitions: await Promise.all(definition.fields.map(fieldInput))
        }
      }
    );
    check(`Creating ${definition.name}`, metaobjectDefinitionCreate);
    console.log(`✓ Created  ${definition.name}`);
    return [];
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
        fieldDefinitions: await Promise.all(
          definition.fields.map(async (field) =>
            have.has(field.key)
              ? {
                  update: {
                    key: field.key,
                    name: field.name,
                    description: field.help ?? "",
                    // Refreshes dropdown options (e.g. new product types).
                    ...(field.type === "choice" || field.type === "choices"
                      ? { validations: await validationsFor(field) }
                      : {})
                  }
                }
              : { create: await fieldInput(field) }
          )
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
  return added.map((field) => field.key);
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

const REFERENCE_TYPES: CmsFieldType[] = [
  "image",
  "images",
  "collection",
  "collections",
  "metaobject",
  "choice",
  "choices"
];

const defaultFor = (field: CmsField, listKey?: string): string => {
  // A list entry's parent (e.g. a footer link's column) is resolved to the
  // parent entry's ID when the entry is created.
  if (field.type === "metaobject" && field.refType && listKey) {
    const parent = defaultContentBlocks[listKey]?.parent;
    return parent ? `ref:${field.refType}/${parent}` : "";
  }
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

async function resolveRefs(values: Values): Promise<{ key: string; value: string }[]> {
  const fields: { key: string; value: string }[] = [];
  for (const [key, value] of Object.entries(values)) {
    if (value === "") {
      continue;
    }
    if (value.startsWith("ref:")) {
      const [type, handle] = value.slice(4).split("/");
      const data = await admin<{ metaobjectByHandle: { id: string } | null }>(
        `query ($handle: MetaobjectHandleInput!) { metaobjectByHandle(handle: $handle) { id } }`,
        { handle: { type, handle } }
      );
      if (data.metaobjectByHandle) {
        fields.push({ key, value: data.metaobjectByHandle.id });
      }
      continue;
    }
    fields.push({ key, value });
  }
  return fields;
}

async function createEntries(definition: CmsDefinition, addedFields: string[]) {
  const existing = await getEntries(definition.type);
  if (existing.length) {
    // A field added to an existing section gets its starter value, once.
    const entry = definition.entry && existing.find((item) => item.handle === definition.entry);
    const planned = definition.entry ? plan.get(definition.type)?.get(definition.entry) : undefined;
    if (entry && planned && addedFields.length) {
      const fields = await resolveRefs(
        Object.fromEntries(addedFields.map((key) => [key, planned[key] ?? ""]))
      );
      if (fields.length) {
        const { metaobjectUpdate } = await admin<{ metaobjectUpdate: UserErrors }>(
          `mutation ($id: ID!, $metaobject: MetaobjectUpdateInput!) {
            metaobjectUpdate(id: $id, metaobject: $metaobject) { userErrors { field message } }
          }`,
          { id: entry.id, metaobject: { fields } }
        );
        check(`Filling new fields of ${definition.name}`, metaobjectUpdate);
        console.log(`  ${definition.name}: filled the new fields (${fields.map((field) => field.key).join(", ")})`);
        return;
      }
    }
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
          fields: await resolveRefs(values)
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

// ---------------------------------------------------------------------------
// Product and collection fields (metafields)
// ---------------------------------------------------------------------------

async function ensureMetafields() {
  for (const metafield of cmsMetafields) {
    const label = `${metafield.ownerType === "PRODUCT" ? "Product" : "Collection"} field “${metafield.name}”`;
    await optional(label, "write_products", async () => {
      const existing = await admin<{ metafieldDefinitions: { nodes: { id: string }[] } }>(
        `query ($ownerType: MetafieldOwnerType!, $key: String!) {
          metafieldDefinitions(first: 1, ownerType: $ownerType, namespace: "custom", key: $key) {
            nodes { id }
          }
        }`,
        { ownerType: metafield.ownerType, key: metafield.key }
      );
      const validations =
        metafield.type === "choice"
          ? [{ name: "choices", value: JSON.stringify(metafield.choices ?? []) }]
          : metafield.type === "metaobject" && metafield.refType
            ? [{ name: "metaobject_definition_id", value: (await getDefinition(metafield.refType))!.id }]
            : [];
      const type =
        metafield.type === "metaobject" ? "metaobject_reference" : "single_line_text_field";

      if (existing.metafieldDefinitions.nodes.length) {
        const { metafieldDefinitionUpdate } = await admin<{ metafieldDefinitionUpdate: UserErrors }>(
          `mutation ($definition: MetafieldDefinitionUpdateInput!) {
            metafieldDefinitionUpdate(definition: $definition) { userErrors { field message } }
          }`,
          {
            definition: {
              ownerType: metafield.ownerType,
              namespace: "custom",
              key: metafield.key,
              name: metafield.name,
              description: metafield.help,
              validations,
              pin: true,
              access: { storefront: "PUBLIC_READ" }
            }
          }
        );
        check(label, metafieldDefinitionUpdate);
        console.log(`✓ Updated  ${label}`);
        return;
      }
      const { metafieldDefinitionCreate } = await admin<{ metafieldDefinitionCreate: UserErrors }>(
        `mutation ($definition: MetafieldDefinitionInput!) {
          metafieldDefinitionCreate(definition: $definition) { userErrors { field message } }
        }`,
        {
          definition: {
            ownerType: metafield.ownerType,
            namespace: "custom",
            key: metafield.key,
            name: metafield.name,
            description: metafield.help,
            type,
            validations,
            pin: true,
            access: { storefront: "PUBLIC_READ" }
          }
        }
      );
      check(label, metafieldDefinitionCreate);
      console.log(`✓ Created  ${label}`);
    });
  }
}

// ---------------------------------------------------------------------------
// Instant updates: webhooks to /api/revalidate
// ---------------------------------------------------------------------------

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/\/$/, "");

async function ensureWebhooks() {
  if (!siteUrl) {
    console.log("  – skipped instant updates (set NEXT_PUBLIC_SITE_URL in .env.local)");
    return;
  }
  const uri = `${siteUrl}/api/revalidate`;
  const existing =
    (await optional("reading webhooks", "read_products", async () => {
      const data = await admin<{ webhookSubscriptions: { nodes: { topic: string; uri: string; filter: string | null }[] } }>(
        `{ webhookSubscriptions(first: 100) { nodes { topic uri filter } } }`
      );
      return data.webhookSubscriptions.nodes;
    })) ?? [];
  const has = (topic: string, filter = "") =>
    existing.some(
      (hook) => hook.topic === topic && hook.uri === uri && (hook.filter ?? "") === filter
    );

  const subscribe = async (topic: string, scope: string, filter = "") => {
    if (has(topic, filter)) {
      return true;
    }
    const done = await optional(`instant updates for ${topic.toLowerCase()}`, scope, async () => {
      const { webhookSubscriptionCreate } = await admin<{ webhookSubscriptionCreate: UserErrors }>(
        `mutation ($topic: WebhookSubscriptionTopic!, $subscription: WebhookSubscriptionInput!) {
          webhookSubscriptionCreate(topic: $topic, webhookSubscription: $subscription) {
            userErrors { field message }
          }
        }`,
        { topic, subscription: { uri, format: "JSON", ...(filter ? { filter } : {}) } }
      );
      check(`Webhook ${topic}`, webhookSubscriptionCreate);
      return true;
    });
    return Boolean(done);
  };

  let count = 0;
  for (const topic of ["PRODUCTS_CREATE", "PRODUCTS_UPDATE", "PRODUCTS_DELETE", "COLLECTIONS_CREATE", "COLLECTIONS_UPDATE", "COLLECTIONS_DELETE"]) {
    count += Number(await subscribe(topic, "read_products"));
  }
  count += Number(await subscribe("INVENTORY_LEVELS_UPDATE", "read_inventory"));
  // Metaobject webhooks need a type filter: one subscription per section.
  for (const definition of cmsDefinitions) {
    for (const topic of ["METAOBJECTS_CREATE", "METAOBJECTS_UPDATE", "METAOBJECTS_DELETE"]) {
      count += Number(await subscribe(topic, "read_metaobjects", `type:${definition.type}`));
    }
  }
  console.log(`✓ Instant updates: ${count} webhooks point to ${uri}`);
}

// ---------------------------------------------------------------------------
// Link check: buttons and menu links pointing to collections that don't exist
// ---------------------------------------------------------------------------

async function checkLinks() {
  const handles = await optional("checking links", "read_products", async () => {
    const data = await admin<{ collections: { nodes: { handle: string }[] } }>(
      `{ collections(first: 250) { nodes { handle } } }`
    );
    return new Set(data.collections.nodes.map((collection) => collection.handle));
  });
  if (!handles) {
    return;
  }
  const problems: string[] = [];
  for (const definition of cmsDefinitions) {
    const linkKeys = definition.fields
      .filter((field) => field.to.endsWith(".ctaLink"))
      .map((field) => field.key);
    if (!linkKeys.length) {
      continue;
    }
    for (const entry of await getEntries(definition.type)) {
      for (const field of entry.fields) {
        const match = linkKeys.includes(field.key)
          ? /\/collections\/([^/?#]+)/.exec(field.value ?? "")
          : null;
        if (match && match[1] !== "all" && !handles.has(match[1])) {
          problems.push(`${definition.name} → ${entry.handle} → “${field.value}” (no collection “${match[1]}”)`);
        }
      }
    }
  }
  if (problems.length) {
    console.log("\n⚠ Links to collections that don't exist yet (create the collection or change the link):");
    problems.forEach((problem) => console.log(`  • ${problem}`));
  } else {
    console.log("✓ All button and menu links point to existing collections");
  }
}

async function main() {
  if (!domain) {
    throw new Error("Set SHOPIFY_STORE_DOMAIN (your-store.myshopify.com) in .env.local.");
  }
  accessToken = await getAccessToken();
  console.log(`Setting up ${domain}…\n`);
  productTypes = await getProductTypes();

  planDefaults();
  const legacy = await planLegacy();

  const added = new Map<string, string[]>();
  for (const definition of cmsDefinitions) {
    added.set(definition.type, await ensureDefinition(definition));
  }
  console.log("");
  for (const definition of cmsDefinitions) {
    await createEntries(definition, added.get(definition.type) ?? []);
  }
  await removeLegacy(legacy);

  console.log("");
  await ensureMetafields();
  await ensureWebhooks();
  await checkLinks();

  if (missingScopes.size) {
    console.log(
      `\nSome steps were skipped. In the Shopify Dev Dashboard, add these permissions to the app,\n` +
        `release a new version, approve it in the store, and run this again:\n  ${[...missingScopes].join(", ")}`
    );
  }
  console.log("\nDone. Edit everything in Shopify admin → Content → Metaobjects.");
}

main().catch((error: unknown) => {
  console.error(`\n✗ ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
