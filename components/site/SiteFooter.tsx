import Link from "next/link";
import { Newsletter } from "@/components/site/Newsletter";

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Facebook", href: "#" },
  { label: "YouTube", href: "#" }
];

const columns: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Shop",
    links: [
      { label: "Clothing", href: "/" },
      { label: "Jewelry", href: "/jewelry" },
      { label: "Shop All", href: "/shop" },
      { label: "Search", href: "/search" }
    ]
  },
  {
    heading: "Collections",
    links: [
      { label: "Luxe Pret", href: "/clothing/collections/luxe-pret" },
      { label: "Bridal", href: "/clothing/collections/bridal" },
      { label: "Heirloom", href: "/jewelry/collections/heirloom" }
    ]
  },
  {
    heading: "House",
    links: [
      { label: "About", href: "/about" },
      { label: "Lookbook", href: "/lookbook" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "The KAYRA List", href: "#newsletter" }
    ]
  },
  {
    heading: "Client Care",
    links: [
      { label: "Shipping & Delivery", href: "/about" },
      { label: "Returns", href: "/about" },
      { label: "Contact", href: "/about" }
    ]
  }
];

export function SiteFooter() {
  return (
    <footer
      className="bg-[var(--kayra-walnut)] text-[var(--kayra-ivory)]"
      id="newsletter"
    >
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-12">
        <div className="flex flex-col gap-12 border-b border-[var(--kayra-ivory)]/15 pb-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-5xl uppercase tracking-[0.2em] md:text-6xl">
              KAYRA
            </p>
            <p className="mt-5 max-w-md text-[11px] uppercase leading-6 tracking-[0.28em] text-[var(--kayra-ivory)]/55">
              A cinematic South Asian luxury house — formal pret, bridal, and
              heirloom jewelry.
            </p>
          </div>
          <Newsletter />
        </div>

        <div className="grid grid-cols-2 gap-10 py-14 md:grid-cols-4">
          {columns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-[10px] uppercase tracking-[0.34em] text-[var(--kayra-ivory)]/50">
                {column.heading}
              </h3>
              <ul className="mt-5 space-y-3 text-[11px] uppercase tracking-[0.22em]">
                {column.links.map((link) => (
                  <li key={`${column.heading}-${link.label}`}>
                    <Link
                      className="magnetic-focus transition hover:text-[var(--kayra-gold)]"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t border-[var(--kayra-ivory)]/15 pt-8 text-[10px] uppercase tracking-[0.28em] text-[var(--kayra-ivory)]/50 sm:flex-row">
          <p>© 2026 KAYRA. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {socials.map((social) => (
              <a
                className="transition hover:text-[var(--kayra-gold)]"
                href={social.href}
                key={social.label}
              >
                {social.label}
              </a>
            ))}
          </div>
          <p>Prices in PKR · Worldwide shipping</p>
        </div>
      </div>
    </footer>
  );
}
