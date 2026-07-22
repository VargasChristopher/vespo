import type { Metadata } from "next";

import { CtaBand } from "@/components/cta-band";
import { SplitHeadline } from "@/components/motion/split-headline";
import { ServicePillars } from "@/components/service-pillars";

export const metadata: Metadata = {
  title: "Food Truck Services · Websites, Social Media & AI",
  description:
    "Three systems built for food trucks: a live-location website with zero commission ordering, social media and local ads run for you, and AI automation you drive by text.",
};

export default function ServicesPage() {
  return (
    <main id="main" className="relative z-10 flex-1">
      <section className="mx-auto w-full max-w-6xl px-6 pt-28 sm:pt-32">
        <div className="mx-auto mb-16 grid max-w-2xl gap-4 text-center sm:mb-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Services · Built specifically for food trucks
          </p>
          <SplitHeadline
            as="h1"
            className="font-display text-display text-balance text-foreground"
          >
            Three systems that pack{" "}
            <span className="bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent">
              the window.
            </span>
          </SplitHeadline>
          <p className="mx-auto max-w-xl text-lede text-muted-foreground">
            A site that takes orders, social media that runs without you, and AI
            you drive by text. Built for trucks that want more customers, not
            more software.
          </p>
        </div>

        <ServicePillars />
      </section>

      <CtaBand
        title="Not sure where you're losing customers?"
        body="The audit is free and tells you: your Google profile, your posts, your site, your ads, your AI. Then a 30-minute call where you watch your new site run. $0 until you love it."
        primary={{ href: "/contact", label: "Get Your Free Marketing Audit" }}
      />
    </main>
  );
}
