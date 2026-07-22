"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Bot,
  Building2,
  CalendarClock,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Truck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Band } from "@/components/band";
import { FloatingOrb } from "@/components/floating-orb";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { SplitHeadline } from "@/components/motion/split-headline";
import { Reveal } from "@/components/reveal";
import { SPRING } from "@/lib/motion";

/*
 * Motion: header line-reveal (SplitText, scroll-triggered); bento cards get
 * scroll reveals + hover lift (SPRING) + pointer spotlight + a ghost Fraunces
 * numeral behind the frosted surface; the guarantee banner is a full-bleed
 * forest band. Ambient orb + live-dot ping loops. All motion collapses to
 * static under prefers-reduced-motion.
 */

const valueCards = [
  {
    tag: "Get Found",
    icon: MapPin,
    title: "Today’s Spot And Today’s Menu, One Tap Away.",
    body: "Your new site loads in 0.3 seconds and shows exactly where you’re parked right now. No PDF, no dead link, no guessing. They tap once and start walking.",
    detail: (
      <div className="flex flex-wrap gap-2">
        {["0.3s menu load", "Live spot, always current", "Live in 14 days"].map(
          (chip) => (
            <Badge
              key={chip}
              variant="outline"
              className="border-primary/30 bg-primary/10 px-2.5 py-1 text-foreground/85"
            >
              {chip}
            </Badge>
          )
        )}
      </div>
    ),
  },
  {
    tag: "Get Followed",
    icon: Bot,
    title: "One Text Updates Your Site And Both Socials.",
    body: "Text it today’s address and the live map moves in seconds. Ask it for a post and it writes one from your menu pics. Behind it we run the local ads, aimed a few miles out instead of at the whole state.",
    detail: (
      <div className="flex items-center gap-3 rounded-xl border border-primary/25 bg-muted/60 px-4 py-3">
        <span className="relative flex size-2.5 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
        </span>
        <p className="text-sm text-foreground">
          Just posted: Parked at Downtown Food Park · 11a to 9p
        </p>
      </div>
    ),
  },
  {
    tag: "Get Booked",
    icon: Building2,
    title: "Catch $5,000+ Catering Gigs Before They Go Cold.",
    body: "Event planners book the truck that answers first. Your catering form triggers an instant AI reply by email and text, so big gigs never sit unread while you serve lunch.",
    detail: (
      <div className="rounded-xl border border-primary/25 bg-muted/60 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-primary/70">
          New catering inquiry · AI replied in 2 min
        </p>
        <p className="mt-1 text-sm text-foreground">
          Corporate lunch · 250 people ·{" "}
          <span className="font-semibold text-primary">$6,200</span>
        </p>
      </div>
    ),
  },
];

const bannerBlocks = [
  {
    icon: ShieldCheck,
    title: "100% Risk-Free Preview Guarantee",
    body: "We build a working mockup of your new site before you pay a dollar. Don't love it? Walk away. Zero obligation.",
  },
  {
    icon: CalendarClock,
    title: "Half Now, Half After Launch",
    body: "Half starts the build. The other half is not due until your site is live and taking orders. No retainer, no lock-in.",
  },
  {
    icon: TrendingUp,
    title: "Self-Funding ROI",
    body: "One corporate catering gig, or 15 extra weekend orders, pays for your whole website refresh.",
  },
];

export function OfferSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="offer"
      className="relative scroll-mt-24 overflow-hidden py-24 sm:py-28"
    >
      <FloatingOrb
        className="-right-40 top-10 size-[26rem] bg-primary/15"
        duration={8}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-14 px-6">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-card/40 px-4 py-1.5 text-sm text-muted-foreground shadow-glow backdrop-blur-md">
            <Truck className="size-4 text-primary" />
            The 14-day refresh · AI assistant built in
          </div>
          <SplitHeadline
            as="h2"
            scrollTrigger
            className="font-display text-title text-balance"
          >
            Get found. Get followed.{" "}
            <span className="bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent">
              Get booked.
            </span>
          </SplitHeadline>
          <p className="text-lede text-muted-foreground">
            One refresh does it: a modern site that shows today’s spot, your posts
            and local ads run for you, and catering leads answered before they go
            cold. You cook. It hustles.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {valueCards.map((card, i) => (
            <Reveal
              key={card.title}
              delay={i * 0.1}
              className="h-full md:last:col-span-2 lg:last:col-span-1"
            >
              <SpotlightCard className="h-full rounded-xl">
                <motion.div
                  className="group h-full"
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -4, scale: 1.01, transition: SPRING }
                  }
                >
                  <Card className="relative isolate h-full overflow-hidden border-border bg-card/40 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 group-hover:border-primary/60 group-hover:shadow-glow-md">
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-4 -z-10 select-none font-display text-[6rem] leading-none text-primary/[0.08]"
                    >
                      0{i + 1}
                    </span>
                    <CardHeader>
                      <div className="mb-2 flex size-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
                        <card.icon className="size-6 text-primary" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-primary/30 text-[10px] uppercase tracking-[0.15em] text-primary/80"
                      >
                        {card.tag}
                      </Badge>
                      <CardTitle className="text-xl leading-snug">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-1 flex-col justify-between gap-6">
                      <CardDescription className="text-[15px] leading-7">
                        {card.body}
                      </CardDescription>
                      {card.detail}
                    </CardContent>
                  </Card>
                </motion.div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Guarantee — full-bleed forest band */}
      <div className="relative z-10 mt-16">
        <Band>
          <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card/50 shadow-glow-md backdrop-blur-xl">
                <BorderBeam size={90} duration={9} />
                <BorderBeam size={90} duration={9} delay={4.5} />
                <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.35fr_1fr_1fr] lg:gap-8">
                  {bannerBlocks.map((block) => (
                    <div key={block.title} className="flex flex-col gap-3">
                      <div className="flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
                        <block.icon className="size-5 text-primary" />
                      </div>
                      <h3 className="font-display text-lg font-medium leading-snug">
                        {block.title}
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        {block.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Band>
      </div>
    </section>
  );
}
