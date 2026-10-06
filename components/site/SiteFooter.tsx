import Link from "next/link";
import { shop } from "@/lib/shop";
import { getBlockList } from "@/lib/shop/blocks";
import { Newsletter } from "@/components/site/Newsletter";

// Shopify → Content → Metaobjects: "Footer — columns" and "Footer — links"
// for the link columns, "Footer" for the text, plus Contact & WhatsApp and
// Social media links. Policies with text in Settings → Policies are listed
// automatically.
export async function SiteFooter() {
  const [columnBlocks, linkBlocks, policies, settings] = await Promise.all([
    getBlockList("footer-column"),
    getBlockList("footer-link"),
    shop.getPolicies(),
    shop.getSiteSettings()
  ]);

  // Contact details from Contact & WhatsApp; each line only shows once it is set.
  const contact = [
    settings.contactEmail && { label: settings.contactEmail, href: `mailto:${settings.contactEmail}` },
    settings.contactPhone && {
      label: settings.contactPhone,
      href: `tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`
    },
    settings.whatsappUrl && {
      label: settings.whatsappNumber ? `WhatsApp ${settings.whatsappNumber}` : "WhatsApp",
      href: settings.whatsappUrl
    },
    settings.address && { label: settings.address, href: "" },
    settings.businessHours && { label: settings.businessHours, href: "" }
  ].filter((item): item is { label: string; href: string } => Boolean(item));

  const columns = columnBlocks
    .map((column) => ({
      title: column.title,
      items: linkBlocks
        .filter((link) => link.parent === column.key && link.title)
        .map((link) => ({ title: link.title, href: link.ctaLink || "/" }))
    }))
    .filter((column) => column.title && column.items.length);

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
          <Newsletter title={settings.newsletterTitle} />
        </div>

        <div
          className={`grid grid-cols-2 gap-x-6 gap-y-10 py-14 ${
            columns.length + (contact.length ? 1 : 0) > 4 ? "md:grid-cols-5" : "md:grid-cols-4"
          }`}
        >
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
          {contact.length ? (
            <div>
              <h3 className="text-[10px] uppercase tracking-[0.34em] text-[var(--kayra-ivory)]/50">
                Contact
              </h3>
              <ul className="mt-5 space-y-3 text-[11px] uppercase leading-5 tracking-[0.2em]">
                {contact.map((item) => (
                  <li className="whitespace-pre-line break-words" key={item.label}>
                    {item.href ? (
                      <a
                        className="magnetic-focus transition hover:text-[var(--kayra-gold-light)]"
                        href={item.href}
                        {...(item.href.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {})}
                      >
                        {item.label}
                      </a>
                    ) : (
                      item.label
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-[var(--kayra-ivory)]/15 pt-8 text-center text-[10px] uppercase tracking-[0.28em] text-[var(--kayra-ivory)]/55 lg:flex-row lg:text-left">
          <p>
            © {new Date().getFullYear()} {settings.copyright}. All rights reserved.
          </p>
          {policies.length ? (
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {policies.map((policy) => (
                <li key={policy.handle}>
                  <Link
                    className="transition hover:text-[var(--kayra-gold-light)]"
                    href={`/policies/${policy.handle}`}
                  >
                    {policy.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
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
