import type { Page, SiteSettings } from "@/lib/shop/types";

/**
 * Plain editorial layout for Shopify Pages and store policies. On the contact
 * page, the contact details from site_settings are listed under the text.
 */
export function RichPage({
  page,
  eyebrow,
  contact
}: {
  page: Page;
  eyebrow: string;
  contact?: SiteSettings;
}) {
  const details = contact
    ? [
        contact.contactEmail && {
          label: "Email",
          value: contact.contactEmail,
          href: `mailto:${contact.contactEmail}`
        },
        contact.contactPhone && {
          label: "Phone",
          value: contact.contactPhone,
          href: `tel:${contact.contactPhone.replace(/[^\d+]/g, "")}`
        },
        contact.whatsappUrl && {
          label: "WhatsApp",
          value: contact.whatsappNumber || "Chat with us",
          href: contact.whatsappUrl
        },
        contact.address && { label: "Visit", value: contact.address, href: "" },
        contact.businessHours && { label: "Hours", value: contact.businessHours, href: "" }
      ].filter((item): item is { label: string; value: string; href: string } => Boolean(item))
    : [];

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 md:px-8">
      <header className="border-b border-[var(--kayra-walnut)]/15 py-14 text-center md:py-20">
        <p className="mb-4 text-[11px] uppercase tracking-[0.45em] text-[var(--kayra-clay)]">
          {eyebrow}
        </p>
        <h1 className="font-display text-4xl uppercase leading-tight tracking-[0.16em] md:text-6xl">
          {page.title}
        </h1>
      </header>
      <article
        className="rte py-12 text-[15px] text-[var(--kayra-walnut)]/80"
        // Content is authored by the merchant in the Shopify admin.
        dangerouslySetInnerHTML={{ __html: page.body }}
      />
      {details.length ? (
        <dl className="grid gap-8 border-t border-[var(--kayra-walnut)]/15 pt-10 sm:grid-cols-2">
          {details.map((item) => (
            <div key={item.label}>
              <dt className="text-[10px] uppercase tracking-[0.34em] text-[var(--kayra-clay)]">
                {item.label}
              </dt>
              <dd className="mt-2 whitespace-pre-line break-words text-[15px] text-[var(--kayra-walnut)]/85">
                {item.href ? (
                  <a
                    className="underline-offset-4 transition hover:underline"
                    href={item.href}
                    {...(item.href.startsWith("http") ? { rel: "noreferrer", target: "_blank" } : {})}
                  >
                    {item.value}
                  </a>
                ) : (
                  item.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
    </main>
  );
}
