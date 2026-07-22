import Image from "next/image";
import Link from "next/link";

import { Band } from "@/components/band";

/* Mirrors the navbar IA: Services · Process · Projects · Reviews · Contact.
   Rendered as a dark forest band — the logos' dark:invert fires inside the
   band under both page themes. */
const footerLinks = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Projects", href: "/work" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <Band as="footer">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-14">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3">
            {/* Lockup proportions mirror the navbar's, scaled to this larger
                wordmark: emblem ≈ 0.93× the wordmark height, and the same
                optical baseline nudge on the wordmark. */}
            <div className="flex items-center gap-3">
              <Image
                src="/assets/vespo_emblem.png"
                alt=""
                width={30}
                height={30}
                className="dark:brightness-0 dark:invert"
              />
              <Image
                src="/assets/vespo_wordmark.png"
                alt="Vespo"
                width={101}
                height={32}
                className="translate-y-[3px] dark:brightness-0 dark:invert"
              />
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Modern websites, social media marketing, and AI built for food trucks nationwide. Born in Austin, TX.
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 pt-6 text-xs leading-5 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Vespo. Founded in Austin, TX.</p>
        </div>
      </div>
    </Band>
  );
}
