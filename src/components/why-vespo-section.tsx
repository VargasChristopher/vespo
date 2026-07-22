"use client";

import { motion, useReducedMotion } from "framer-motion";
import { KeyRound, Scale, Timer, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FloatingOrb } from "@/components/floating-orb";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { SpotlightCard } from "@/components/motion/spotlight-card";
import { SplitHeadline } from "@/components/motion/split-headline";
import { Reveal } from "@/components/reveal";
import { SPRING } from "@/lib/motion";

/*
 * Numbers below were pulled live from ChowNow's public pricing page and
 * BentoBox's availability FAQ (July 2026): keep the receipts line in sync
 * if these claims change. The $16,164 is derived, not sourced separately:
 * $449/mo × 36 months. Re-derive it if the top-plan price moves.
 *
 * Motion: header line-reveal (SplitText, scroll-triggered) + card scroll
 * reveals + hover lift (SPRING) + pointer spotlight. Stats count up.
 * All motion collapses to static under prefers-reduced-motion.
 */

const takedowns = [
  {
    icon: Wallet,
    stat: "$50/month",
    versus: "vs $229 to $449/mo + 2.95% fees",
    title: "One flat rate. Zero commissions.",
    body: "Their subscription runs $16,164 over three years. Then 2.95% of every order on top. We never take a cut.",
  },
  {
    icon: Timer,
    stat: "14 days",
    versus: "vs “demo calls” and stock templates",
    title: "Live before your next weekend rush.",
    body: "Send us menu pics and your schedule. That’s your whole job. We custom-build the rest.",
  },
  {
    icon: KeyRound,
    stat: "100% yours",
    versus: "vs POS lock-in and price hikes",
    title: "Your domain. Your data.",
    body: "Leave their platform and the site stays with them, customer list included. Ours leaves with you, domain and all.",
  },
];

export function WhyVespoSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="why-vespo"
      className="relative scroll-mt-24 overflow-hidden px-6 py-24 sm:py-28"
    >
      <FloatingOrb
        className="-right-40 top-1/3 size-[26rem] bg-primary/10"
        duration={8}
        delay={0.5}
      />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-card/40 px-4 py-1.5 text-sm text-muted-foreground shadow-glow backdrop-blur-md">
            <Scale className="size-4 text-primary" />
            Why Vespo beats SaaS
          </div>
          <SplitHeadline
            as="h2"
            scrollTrigger
            className="font-display text-title text-balance"
          >
            Own your engine.{" "}
            <span className="bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent">
              Stop renting a template.
            </span>
          </SplitHeadline>
          <p className="text-lede text-muted-foreground">
            Straight from the big platforms&apos; own pricing pages and fine
            print. Here&apos;s what they hope you skip.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {takedowns.map((item, i) => (
            <Reveal key={item.stat} delay={i * 0.1} className="h-full">
              <SpotlightCard className="h-full rounded-xl">
                <motion.div
                  className="group h-full"
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -4, scale: 1.01, transition: SPRING }
                  }
                >
                  <Card className="h-full border-border bg-card/40 backdrop-blur-xl transition-[border-color,box-shadow] duration-300 group-hover:border-primary/60 group-hover:shadow-glow-md">
                    <CardHeader>
                      <div className="mb-2 flex size-10 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
                        <item.icon className="size-5 text-primary" />
                      </div>
                      <p className="font-display text-4xl font-medium tracking-tight text-primary-strong">
                        <AnimatedNumber value={item.stat} />
                      </p>
                      <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                        {item.versus}
                      </p>
                      <CardTitle className="pt-1 text-lg leading-snug">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-[15px] leading-7">
                        {item.body}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
