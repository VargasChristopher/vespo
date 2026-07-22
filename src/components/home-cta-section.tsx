import { CtaBand } from "@/components/cta-band";

/* Homepage closing band — the shared book-a-call CTA (full-bleed forest). */
export function HomeCtaSection() {
  return (
    <CtaBand
      title="See your truck's new site before you pay a dollar."
      body="Start free: we audit your Google profile, your posts, your site, your ads, and your AI. Then a 30-minute call where you watch your new site run. $0 until you love it."
      primary={{ href: "/contact", label: "Get Your Free Marketing Audit" }}
    />
  );
}
