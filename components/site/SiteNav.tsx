import { shop } from "@/lib/shop";
import { getBlockList } from "@/lib/shop/blocks";
import type { MenuItem } from "@/lib/shop/types";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { SiteNavClient } from "@/components/site/SiteNavClient";

// Shopify → Content → Metaobjects: "Header menu" items, their "Header menu —
// dropdown links", and the "Announcement bar".
export async function SiteNav() {
  const [items, links, settings] = await Promise.all([
    getBlockList("menu-item"),
    getBlockList("menu-link"),
    shop.getSiteSettings()
  ]);

  const menu: MenuItem[] = items
    .filter((item) => item.title)
    .map((item) => ({
      title: item.title,
      href: item.ctaLink || "/",
      items: links
        .filter((link) => link.parent === item.key && link.title)
        .map((link) => ({ title: link.title, href: link.ctaLink || "/", items: [] }))
    }));

  return (
    <>
      <AnnouncementBar messages={settings.announcements} scroll={settings.announcementScroll} />
      <SiteNavClient menu={menu} />
    </>
  );
}
