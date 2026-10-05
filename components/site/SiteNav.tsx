import { shop } from "@/lib/shop";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import { SiteNavClient } from "@/components/site/SiteNavClient";

// Header content is managed in Shopify: the "main-menu" navigation menu drives
// the links, and the site_settings metaobject drives the announcement bar.
export async function SiteNav() {
  const [menu, settings] = await Promise.all([
    shop.getMenu("main-menu"),
    shop.getSiteSettings()
  ]);

  return (
    <>
      <AnnouncementBar primary={settings.announcement} secondary={settings.announcementSecondary} />
      <SiteNavClient menu={menu ?? []} />
    </>
  );
}
