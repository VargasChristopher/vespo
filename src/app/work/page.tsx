import type { Metadata } from "next";
import { ShieldCheck, TrendingUp, Truck } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { SplitHeadline } from "@/components/motion/split-headline";
import { RevealItem, RevealStagger } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Food Truck Projects · Taking Our First Trucks",
  description:
    "Vespo is new, so there are no case studies here yet. We are picking our first food trucks now, and real numbers get published on this page as they launch.",
};

/* No case studies exist yet (the user has not shipped a client site). Nothing
   on this page may be fabricated: no truck names, no metrics, no logos. It
   sells going first instead, on claims that are already true elsewhere on the
   site (the $0 preview, the 50/50 payment split). No scarcity claims. */
const GOING_FIRST = [
  {
    icon: ShieldCheck,
    kicker: "Nothing to trust",
    title: "You see it before you pay.",
    body: "We build a working preview of your new site first. Look at your own truck on your own phone, then decide. Don’t love it? Walk away.",
  },
  {
    icon: Truck,
    kicker: "Straight to the builder",
    title: "You get the builders, not a queue.",
    body: "Going first means the people building your site are the people answering your texts. No account manager, no ticket queue, no handoff.",
  },
  {
    icon: TrendingUp,
    kicker: "Published here",
    title: "Your numbers fill this page.",
    body: "Order volume, commission saved, menu load time, catering booked. When your truck launches, the real results go right here.",
  },
];

export default function WorkPage() {
  return (
    <main id="main" className="relative z-10 flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 sm:pt-32">
        {/* Header */}
        <div className="mx-auto mb-16 grid max-w-3xl gap-4 text-center sm:mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Projects · Taking our first trucks
          </p>
          <SplitHeadline
            as="h1"
            className="font-display text-display text-balance text-foreground"
          >
            No case studies yet.{" "}
            <span className="bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent">
              Yours could be first.
            </span>
          </SplitHeadline>
          <p className="mx-auto max-w-2xl text-lede text-muted-foreground">
            Vespo is brand new. Instead of showing you someone else&apos;s
            numbers, we build a working preview of your own truck&apos;s site and
            let you judge that.
          </p>
        </div>

        {/* Why go first */}
        <RevealStagger className="grid gap-6 md:grid-cols-3">
          {GOING_FIRST.map((item) => (
            <RevealItem key={item.title} className="h-full">
              <SpotlightCard className="h-full rounded-3xl">
                <div className="flex h-full flex-col gap-4 rounded-3xl border border-border/60 bg-card/40 p-7 shadow-glow backdrop-blur-xl transition-colors hover:border-primary/40">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
                    <item.icon className="size-5 text-primary" />
                  </span>
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary-strong">
                      {item.kicker}
                    </p>
                    <h2 className="mt-2 font-display text-title-sm text-balance text-foreground">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-[15px] leading-7 text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              </SpotlightCard>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      <CtaBand
        title="Want to be case study number one?"
        body="Book a free 30-minute call. We audit your site and socials, then build a working preview of your new site. $0 until you love it."
        primary={{ href: "/contact", label: "Get Your Free Marketing Audit" }}
        secondary={{ href: "/services", label: "See the Three Systems" }}
      />
    </main>
  );
}
