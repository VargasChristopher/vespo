"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Sparkles, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FloatingOrb } from "@/components/floating-orb";
import { SplitHeadline } from "@/components/motion/split-headline";
import { gsap, useGSAP } from "@/lib/gsap";
import { SPRING, VIEWPORT_ONCE } from "@/lib/motion";

/*
 * Motion:
 * 1. Header line-reveal (SplitText, scroll-triggered).
 * 2. Panel scroll reveal — framer whileInView on the inner node (once,
 *    -100px; 0.15s right-panel delay) + hover lift (SPRING). This is the
 *    mobile / reduced-motion presentation.
 * 3. Desktop showpiece (≥1024px, no-preference): the grid pins and, on
 *    scrub, the trap panel recedes while the Vespo engine panel rises and
 *    the VS coin spins. The last third of the pin dissolves the whole block
 *    so it is gone before the next section arrives. GSAP owns the OUTER
 *    panel nodes; framer owns the INNER nodes — never the same element.
 *    Everything is static under prefers-reduced-motion.
 */

const trapItems = [
  "Instagram silent for two weeks because you were slammed on the grill",
  "Answering the same DM 50 times: “Where are you parked today?”",
  "Last month’s hours and a sold-out menu still live on your site",
  "Catering emails sitting unread until the gig goes to another truck",
  "A slow PDF menu and a dead link-in-bio at peak Friday rush",
  "No ads running, so the only people who show up already knew you",
];

const engineItems: { text: string; badges?: string[] }[] = [
  { text: "A 0.3s site with today’s spot, hours, and menu always current" },
  { text: "One text to your AI updates the site and both socials" },
  { text: "Your AI answers “where are you parked?” day and night" },
  { text: "Catering leads get an email and text reply in minutes, not days" },
  { text: "1-tap order-ahead at 0% commission: every dollar stays yours" },
  { text: "Local ads and daily posts aimed a few miles from your window" },
];

export function ComparisonSection() {
  const reduceMotion = useReducedMotion();
  const scope = useRef<HTMLElement>(null);
  const fadeRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trapRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<HTMLDivElement>(null);
  const vsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: pinRef.current!,
              start: "center center",
              end: "+=130%",
              pin: true,
              // The pin's parent is a flex column, and ScrollTrigger silently
              // drops pinSpacing in that case (ScrollTrigger.js: "if the parent
              // is display: flex, don't apply pinSpacing by default"), which let
              // the next section scroll straight over the pinned grid. "margin"
              // is the flex-safe spacing mode.
              pinSpacing: "margin",
              scrub: 0.6,
              anticipatePin: 1,
            },
          });
          // 0 → 0.6 of the pin: the VS scene (unchanged).
          tl.to(
            trapRef.current,
            { yPercent: 8, scale: 0.95, autoAlpha: 0.45, ease: "none", duration: 0.6 },
            0
          )
            .to(
              engineRef.current,
              { yPercent: -8, scale: 1.04, ease: "none", duration: 0.6 },
              0
            )
            .to(
              vsRef.current,
              { scale: 1.25, rotate: 180, ease: "none", duration: 0.6 },
              0
            )
            // 0.6 → 0.82: a fast dissolve (power2.out drops most of the
            // opacity up front, so it never lingers as a half-transparent
            // ghost). autoAlpha lands on visibility:hidden, not just 0 alpha.
            // Opacity only — a transform on this wrapper would make it the
            // containing block for the pinned (position: fixed) grid.
            .to(
              fadeRef.current,
              { autoAlpha: 0, ease: "power2.out", duration: 0.22 },
              0.6
            )
            // 0.82 → 1: hold on the empty frame. This tail is what guarantees
            // the block is already invisible while #why-vespo is still below
            // the fold, so the two never share the screen.
            .to({}, { duration: 0.18 });
        }
      );
      return () => mm.revert();
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      id="before-after"
      className="relative scroll-mt-24 px-6 py-24 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <FloatingOrb
          className="-left-40 bottom-0 size-[26rem] bg-chart-2/10"
          duration={7}
          delay={1}
        />
      </div>

      <div ref={fadeRef} className="relative z-10 mx-auto flex max-w-7xl flex-col gap-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
          <div className="flex items-center gap-2 rounded-full border border-primary/25 bg-card/40 px-4 py-1.5 text-sm text-muted-foreground shadow-glow backdrop-blur-md">
            <Sparkles className="size-4 text-primary" />
            Before &amp; after
          </div>
          <SplitHeadline
            as="h2"
            scrollTrigger
            className="font-display text-title text-balance"
          >
            Same truck.{" "}
            <span className="bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent">
              Different machine.
            </span>
          </SplitHeadline>
          <p className="text-lede text-muted-foreground">
            The difference between a truck nobody finds and one that keeps
            a line at the window while you cook.
          </p>
        </div>

        <div ref={pinRef} className="relative grid gap-8 md:grid-cols-2">
          {/* The trap */}
          <div ref={trapRef} className="group">
            {/* h-full is load-bearing: the grid column stretches, but without
                it this wrapper collapses to content height and the Card's
                h-full resolves against that, so the two panels desync. */}
            <motion.div
              className="h-full"
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -4, scale: 1.01, transition: SPRING }
              }
            >
              <Card className="h-full border-border bg-card/30 py-8 backdrop-blur-xl transition-[border-color] duration-300 group-hover:border-foreground/25 sm:py-10">
                <CardHeader className="px-7 sm:px-9">
                  <div className="mb-2 flex size-12 items-center justify-center rounded-xl border border-destructive/25 bg-destructive/10">
                    <X className="size-6 text-destructive/80" />
                  </div>
                  <Badge
                    variant="outline"
                    className="border-border text-[11px] uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    The old way
                  </Badge>
                  <CardTitle className="font-display text-2xl sm:text-3xl">
                    The Food Truck Trap
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-7 sm:px-9">
                  <ul className="flex flex-col gap-5">
                    {trapItems.map((item) => (
                      <li key={item} className="flex items-start gap-3.5">
                        <X className="mt-1 size-5 shrink-0 text-destructive/70" />
                        <span className="text-base leading-7 text-muted-foreground sm:text-[17px] sm:leading-8">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* The engine */}
          <div ref={engineRef} className="group">
            <motion.div
              className="h-full"
              initial={reduceMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEWPORT_ONCE}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -4, scale: 1.01, transition: SPRING }
              }
            >
              <Card className="h-full border-primary/40 bg-card/50 py-8 shadow-glow-md backdrop-blur-xl transition-[border-color,box-shadow] duration-300 group-hover:border-primary/70 group-hover:shadow-glow-lg sm:py-10">
                <CardHeader className="px-7 sm:px-9">
                  <div className="mb-2 flex size-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/15">
                    <Sparkles className="size-6 text-primary" />
                  </div>
                  <Badge className="text-[11px] uppercase tracking-[0.15em]">
                    The Vespo way
                  </Badge>
                  <CardTitle className="font-display text-2xl sm:text-3xl">
                    The Vespo Food Truck Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-7 sm:px-9">
                  <ul className="flex flex-col gap-5">
                    {engineItems.map((item) => (
                      <li key={item.text} className="flex items-start gap-3.5">
                        <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                        <span className="text-base leading-7 text-foreground/90 sm:text-[17px] sm:leading-8">
                          {item.text}
                          {item.badges && (
                            <span className="ml-2 inline-flex gap-1.5 align-middle">
                              {item.badges.map((badge) => (
                                <Badge
                                  key={badge}
                                  variant="outline"
                                  className="border-primary/30 bg-primary/10 text-[10px] text-foreground/85"
                                >
                                  {badge}
                                </Badge>
                              ))}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* VS divider — centered by the wrapper so GSAP owns the coin's
              transform (scale/rotate) without fighting a translate. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 hidden place-items-center md:grid"
          >
            <div
              ref={vsRef}
              className="grid size-16 place-items-center rounded-full border border-primary/40 bg-background/90 font-display text-base font-bold tracking-wide text-primary shadow-glow-md backdrop-blur-xl"
            >
              VS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
