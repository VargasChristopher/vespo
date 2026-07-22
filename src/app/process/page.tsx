import type { Metadata } from "next";
import { Fragment } from "react";
import { ArrowRight } from "lucide-react";

import { CtaBand } from "@/components/cta-band";
import { SplitHeadline } from "@/components/motion/split-headline";
import { ProcessTimeline } from "@/components/process-timeline";

export const metadata: Metadata = {
  title: "The Process: Free Audit, Then Live in 14 Days",
  description:
    "How Vespo works: a free audit of your Google profile, socials, website, ads, and AI. Then a 30-minute call where you watch your new site run. Half up front, half after it is live, $50/month to keep it running.",
};

const OVERVIEW = [
  "Free Marketing Audit",
  "The Audit Call",
  "The Closing Call",
  "Onboarding & Build",
  "Launch & Upkeep",
];

export default function ProcessPage() {
  return (
    <main id="main" className="relative z-10 flex-1">
      <section className="mx-auto w-full max-w-5xl px-6 pt-28 sm:pt-32">
        <div className="mx-auto mb-8 grid max-w-2xl gap-4 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            The Process · Free audit to live in 14 days
          </p>
          <SplitHeadline
            as="h1"
            className="font-display text-display text-balance text-foreground"
          >
            Free audit first.{" "}
            <span className="bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent">
              You pay when you’ve seen it.
            </span>
          </SplitHeadline>
          <p className="mx-auto max-w-xl text-lede text-muted-foreground">
            Five steps from a cold audit to a live site, and you cook through all of
            them. Here is exactly what happens, what it costs, and when you owe it.
          </p>
        </div>

        <nav
          aria-label="Process overview"
          className="mb-16 flex flex-wrap items-center justify-center gap-2 sm:mb-20"
        >
          {OVERVIEW.map((label, i) => (
            <Fragment key={label}>
              <a
                href={`#phase-${i + 1}`}
                className="rounded-full border border-border/60 bg-card/40 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground backdrop-blur-md transition-colors hover:border-primary/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="text-primary-strong">0{i + 1}</span> {label}
              </a>
              {i < OVERVIEW.length - 1 && (
                <ArrowRight aria-hidden className="size-3.5 text-muted-foreground/60" />
              )}
            </Fragment>
          ))}
        </nav>

        <ProcessTimeline />
      </section>

      <CtaBand
        title="Step one is free. Start there."
        body="Book your audit. We check your Google profile, socials, site, and ads, then show you your new site running. You decide after that, not before."
        primary={{ href: "/contact", label: "Get Your Free Marketing Audit" }}
      />
    </main>
  );
}
