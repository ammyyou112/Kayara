import Link from "next/link";
import { shop } from "@/lib/shop";
import { Newsletter } from "@/components/site/Newsletter";

// Footer columns come from the Shopify "footer" menu (each top-level item is a
// column heading, its children are the links). Tagline, socials and the
// bottom note come from the site_settings metaobject.
export async function SiteFooter() {
  const [menu, settings] = await Promise.all([shop.getMenu("footer"), shop.getSiteSettings()]);

  // A footer menu built as a flat list (no children) becomes a single column.
  const columns = (menu ?? []).some((item) => item.items.length)
    ? (menu ?? []).filter((item) => item.items.length)
    : [{ title: "Explore", href: "", items: menu ?? [] }];

  return (
    <footer className="bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)]" id="newsletter">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="flex flex-col gap-12 border-b border-[var(--kayra-ivory)]/15 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-5xl uppercase tracking-[0.2em] md:text-6xl">KAYRA</p>
            {settings.tagline ? (
              <p className="mt-5 max-w-md text-[11px] uppercase leading-6 tracking-[0.28em] text-[var(--kayra-ivory)]/60">
                {settings.tagline}
              </p>
            ) : null}
          </div>
          <Newsletter />
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-14 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-[10px] uppercase tracking-[0.34em] text-[var(--kayra-ivory)]/50">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3 text-[11px] uppercase leading-5 tracking-[0.2em]">
                {column.items.map((link) => (
                  <li key={`${column.title}-${link.title}`}>
                    {/^https?:\/\//.test(link.href) ? (
                      <a
                        className="magnetic-focus transition hover:text-[var(--kayra-gold-light)]"
                        href={link.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {link.title}
                      </a>
                    ) : (
                      <Link
                        className="magnetic-focus transition hover:text-[var(--kayra-gold-light)]"
                        href={link.href || "/"}
                      >
                        {link.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-[var(--kayra-ivory)]/15 pt-8 text-center text-[10px] uppercase tracking-[0.28em] text-[var(--kayra-ivory)]/55 lg:flex-row lg:text-left">
          <p>© {new Date().getFullYear()} KAYRA. All rights reserved.</p>
          {settings.socials.length ? (
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {settings.socials.map((social) => (
                <li key={social.label}>
                  <a
                    className="transition hover:text-[var(--kayra-gold-light)]"
                    href={social.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {settings.footerNote ? <p>{settings.footerNote}</p> : null}
        </div>
      </div>
    </footer>
  );
}
