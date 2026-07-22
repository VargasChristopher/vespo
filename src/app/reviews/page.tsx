import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarClock, ShieldCheck, TrendingUp, Zap } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { SplitHeadline } from "@/components/motion/split-headline";
import { Reveal, RevealItem, RevealStagger } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Client Reviews · Coming Soon",
  description:
    "No reviews yet. Vespo just opened and our first food trucks launch soon. Until then, the $0 working preview is the proof: see your own site before you pay.",
};

/* There are no clients yet, so there are no testimonials. Nothing here may be
   fabricated: no names, no trucks, no star ratings, no aggregateRating JSON-LD.
   Absent social proof is answered with the risk reversal instead. */
const MEANWHILE = [
  {
    icon: Zap,
    href: "/services",
    title: "Try the live demos",
    body: "Tap through the real ordering flow and the text thread that runs the site.",
  },
  {
    icon: CalendarClock,
    href: "/process",
    title: "Read the 14-day process",
    body: "Every step from the first call to launch day, and what we need from you.",
  },
  {
    icon: TrendingUp,
    href: "/work",
    title: "See what goes on the wall",
    body: "The numbers we publish the moment our first trucks are live.",
  },
];

export default function ReviewsPage() {
  return (
    <main id="main" className="relative z-10 flex-1">
      <section className="mx-auto w-full max-w-5xl px-6 pt-28 sm:pt-32">
        {/* Header */}
        <div className="mx-auto mb-14 grid max-w-3xl gap-4 text-center sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Reviews · Coming soon
          </p>
          <SplitHeadline
            as="h1"
            className="font-display text-display text-balance text-foreground"
          >
            No reviews yet.{" "}
            <span className="bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent">
              We just opened.
            </span>
          </SplitHeadline>
          <p className="mx-auto max-w-2xl text-lede text-muted-foreground">
            Our first trucks launch in the next few weeks. Their words go here
            with their name and their truck on them, exactly as they write them.
          </p>
        </div>

        {/* The risk reversal stands in for social proof */}
        <Reveal>
          <div className="rounded-3xl border border-primary/40 bg-card/50 p-8 text-center shadow-glow-md backdrop-blur-xl sm:p-12">
            <span className="mx-auto flex size-11 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
              <ShieldCheck className="size-5 text-primary" />
            </span>
            <h2 className="mt-5 font-display text-title text-balance text-foreground">
              You don&apos;t have to take anyone&apos;s word for it.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lede text-muted-foreground">
              That is the whole point of the $0 preview. We build a working
              version of your new site before you pay a dollar. You look at your
              own truck on your own phone, then decide.
            </p>
          </div>
        </Reveal>

        {/* Somewhere to go instead of a dead end */}
        <RevealStagger className="mt-6 grid gap-6 md:grid-cols-3">
          {MEANWHILE.map((item) => (
            <RevealItem key={item.href} className="h-full">
              <Link
                href={item.href}
                className="group flex h-full flex-col gap-3 rounded-3xl border border-border/60 bg-card/40 p-7 shadow-glow backdrop-blur-xl transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
                  <item.icon className="size-5 text-primary" />
                </span>
                <h3 className="font-display text-title-sm text-balance text-foreground">
                  {item.title}
                </h3>
                <p className="text-[15px] leading-7 text-muted-foreground">
                  {item.body}
                </p>
                <span className="mt-auto flex items-center gap-1.5 pt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-primary-strong">
                  Take a look
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </RevealItem>
          ))}
        </RevealStagger>
      </section>

      <CtaBand
        title="Be the first review on this page."
        body="Book a free 30-minute call. We audit your site and socials, then build a working preview of your new site. $0 until you love it."
        primary={{ href: "/contact", label: "Get Your Free Marketing Audit" }}
        secondary={{ href: "/services", label: "See the Three Systems" }}
      />
    </main>
  );
}
