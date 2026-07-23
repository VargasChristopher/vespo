"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Utensils } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { Parallax } from "@/components/motion/parallax";
import { gsap, useGSAP } from "@/lib/gsap";
import { G } from "@/lib/motion";

/*
 * Hero. Orchestrated GSAP entrance timeline: badge → masked headline lines
 * (each sentence slides up from behind its own clip) → lede → CTAs → trust
 * row. Content is authored visible, so reduced-motion / no-JS renders the
 * final state with no flash. Scrubbed parallax orbs sit behind the copy.
 * CTA hover/tap magnetism via <Magnetic>.
 */

const trustPoints = [
  "Free Audit First",
  "14 Day Turnaround",
  "0% Commission Ordering",
];

export function HeroSection() {
  const reduce = !!useReducedMotion();
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (reduce) return;
      const tl = gsap.timeline({ defaults: { ease: G.ease } });
      tl.from("[data-hero-badge]", { autoAlpha: 0, y: 12, duration: 0.6 })
        .from(
          "[data-hero-line]",
          {
            y: 40,
            autoAlpha: 0,
            duration: 1,
            ease: G.easeLine,
            stagger: G.stagger,
          },
          "-=0.3"
        )
        .from(
          "[data-hero-lede]",
          { autoAlpha: 0, y: 16, duration: 0.7 },
          "-=0.6"
        )
        .from("[data-hero-cta]", { autoAlpha: 0, y: 16, duration: 0.6 }, "-=0.45")
        .from(
          "[data-hero-trust] > li",
          { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.06 },
          "-=0.35"
        );
    },
    { scope, dependencies: [reduce] }
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-[calc(100svh-4rem)] flex-1 items-center justify-center overflow-hidden"
    >
      {/* Scrubbed parallax ambient orbs */}
      <Parallax
        y={[40, -60]}
        className="pointer-events-none absolute -left-24 top-24 hidden md:block"
      >
        <div className="size-[22rem] rounded-full bg-primary/10 blur-[100px]" />
      </Parallax>
      <Parallax
        y={[20, -30]}
        className="pointer-events-none absolute -right-24 bottom-16 hidden md:block"
      >
        <div className="size-[26rem] rounded-full bg-chart-2/10 blur-[110px]" />
      </Parallax>

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 px-6 py-28 text-center">
        <div
          data-hero-badge
          className="flex items-center gap-2 rounded-full border border-primary/25 bg-card/40 px-4 py-1.5 text-sm text-muted-foreground shadow-glow backdrop-blur-md"
        >
          <Image
            src="/assets/vespo_emblem.png"
            alt=""
            width={18}
            height={18}
            className="dark:brightness-0 dark:invert"
          />
          Austin, TX | Digital Marketing for Food Trucks.
        </div>

        <h1 className="font-display text-display text-balance text-foreground">
          <span
            data-hero-line
            className="block bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent"
          >
            Hungry people are searching right now.
          </span>
          <span data-hero-line className="mt-1 block">
            Make sure they find your truck first.
          </span>
        </h1>

        <p data-hero-lede className="max-w-2xl text-lede text-muted-foreground">
          We rebuild your site, run your posts and local ads, and hand you an AI
          you drive by text. Start with a free audit of everything you have now.
          You see the whole thing before you pay a dollar. Live in 14 days.
        </p>

        <div
          data-hero-cta
          className="flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic>
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-full px-4 text-sm shadow-glow-lg hover:shadow-glow-xl sm:px-7 sm:text-base"
            >
              <Link href="/contact">
                <Sparkles />
                Get Your Free Marketing Audit
                <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </Magnetic>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 rounded-full border-primary/30 bg-card/40 px-7 text-base text-foreground/90 backdrop-blur-md hover:bg-primary/10 hover:text-foreground"
          >
            <Link href="/services">
              <Utensils />
              See the Three Systems
            </Link>
          </Button>
        </div>

        <ul
          data-hero-trust
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          {trustPoints.map((point) => (
            <li key={point} className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
