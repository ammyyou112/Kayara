import { cache } from "react";
import { shop } from "./index";
import { defaultContentBlocks } from "./content";
import type { ContentBlock, ContentBlockDefaults } from "./types";

// Editable storefront sections. Shopify's content_block entries are fetched
// once per request; each field falls back to lib/shop/content.ts when empty.

const loadBlocks = cache(async () => shop.getContentBlocks());

const withDefaults = (key: string, block?: ContentBlock): ContentBlock => {
  const fallback: ContentBlockDefaults = defaultContentBlocks[key] ?? {};
  return {
    key,
    eyebrow: block?.eyebrow || fallback.eyebrow || "",
    title: block?.title || fallback.title || "",
    subtitle: block?.subtitle || fallback.subtitle || "",
    body: block?.body || fallback.body || "",
    images: block?.images.length ? block.images : (fallback.images ?? []),
    ctaLabel: block?.ctaLabel || fallback.ctaLabel || "",
    ctaLink: block?.ctaLink || fallback.ctaLink || "",
    collection: block?.collection || fallback.collection || "",
    position: block && block.position !== 999 ? block.position : (fallback.position ?? 999)
  };
};

/** One section, e.g. getBlock("home-statement"). */
export async function getBlock(key: string): Promise<ContentBlock> {
  const blocks = await loadBlocks();
  return withDefaults(key, blocks.find((block) => block.key === key));
}

/** Several sections at once, in the order requested. */
export async function getBlockMap<K extends string>(keys: K[]): Promise<Record<K, ContentBlock>> {
  const entries = await Promise.all(keys.map(async (key) => [key, await getBlock(key)] as const));
  return Object.fromEntries(entries) as Record<K, ContentBlock>;
}

/**
 * A repeatable list, e.g. getBlockList("lookbook-chapter") returns every
 * lookbook-chapter-* entry sorted by Position. When Shopify has none, the
 * built-in defaults are used.
 */
export async function getBlockList(prefix: string): Promise<ContentBlock[]> {
  const matches = (key: string) => key.startsWith(`${prefix}-`);
  const blocks = (await loadBlocks()).filter((block) => matches(block.key));
  const list = blocks.length
    ? blocks.map((block) => withDefaults(block.key, block))
    : Object.keys(defaultContentBlocks)
        .filter(matches)
        .map((key) => withDefaults(key));
  return list.sort((a, b) => a.position - b.position || a.key.localeCompare(b.key));
}

/** Splits a multi-line text field into paragraphs (blank line = new paragraph). */
export const paragraphs = (body: string): string[] =>
  body
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
