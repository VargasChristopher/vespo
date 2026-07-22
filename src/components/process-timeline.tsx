"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import {
  ArrowLeftRight,
  Blocks,
  Check,
  CheckCircle2,
  ClipboardList,
  FileText,
  Globe,
  Monitor,
  QrCode,
  Rocket,
  ShieldCheck,
  X,
} from "lucide-react";

import { Reveal } from "@/components/reveal";
import { SPRING } from "@/lib/motion";

/*
 * Animation spec (.claude/rules/animation-spec.md):
 * 1. Scroll-drawn rail. Trigger: useScroll over the timeline container.
 *    Target: the vertical primary line. Effect: scaleY 0→1 (origin top),
 *    smoothed with useSpring (stiffness 120, damping 30).
 * 2. Phase reveals: shared <Reveal /> (whileInView, once, -100px).
 * 3. Meters & progress. Trigger: whileInView (once). Target: bar fills.
 *    Effect: width 0→n%, 0.8s easeOut.
 * 4. Card hover: whileHover y -4 / scale 1.01, SPRING.
 * Reduced motion: rail renders fully drawn, bars render at value, no lifts.
 *
 * The five phases mirror the real engagement, told from the client's side.
 * The audit is the lead magnet (offered cold by email/DM/call, or requested
 * here), then TWO separate calls: the audit call with the live screen-share
 * reveal, and a short closing call that takes the 50% deposit. The $0 gate
 * sits after phase 02 — the last point where a truck can walk having spent
 * nothing.
 */

type IconType = React.ComponentType<{ className?: string }>;

/* ---------------------------------------------------------------------- */
/* Building blocks                                                         */

function VisualCard({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const reduceMotion = !!useReducedMotion();
  return (
    <motion.div
      role="group"
      aria-label={label}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={SPRING}
      className="grid gap-3.5 rounded-3xl border border-border/60 bg-card/50 p-5 shadow-glow backdrop-blur-xl transition-colors hover:border-primary/40 sm:p-6"
    >
      {children}
    </motion.div>
  );
}

function CardRow({ icon: Icon, text }: { icon: IconType; text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
        <Icon className="size-3.5 text-primary" />
      </span>
      <span className="text-sm text-foreground/85">{text}</span>
    </div>
  );
}

/* A failing audit check: the one place red is warranted on this page. */
function FailRow({ label, finding }: { label: string; finding: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-destructive/25 bg-destructive/10">
        <X className="size-3.5 text-destructive/80" />
      </span>
      <span className="flex-1 text-sm text-foreground/85">{label}</span>
      <span className="font-mono text-[11px] text-muted-foreground">{finding}</span>
    </div>
  );
}

function Bar({ pct }: { pct: number }) {
  const reduceMotion = !!useReducedMotion();
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-primary/15">
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={reduceMotion ? false : { width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );
}

function Meter({ label, pct }: { label: string; pct: number }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-foreground/85">{label}</span>
        <span className="font-mono tabular-nums text-muted-foreground">{pct}%</span>
      </div>
      <Bar pct={pct} />
    </div>
  );
}

function LiveDot() {
  const reduceMotion = !!useReducedMotion();
  return (
    <span className="relative flex size-2.5 shrink-0">
      {!reduceMotion && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
      )}
      <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Phase visuals                                                           */

const AUDIT_CHECKS = [
  { label: "Google profile", finding: "photos from 2019" },
  { label: "Instagram + TikTok", finding: "last post 3 weeks" },
  { label: "Website", finding: "8.4s on mobile" },
  { label: "Paid ads", finding: "none running" },
  { label: "AI", finding: "not in use" },
];

function AuditCard() {
  return (
    <VisualCard label="Example: what the free marketing audit turns up">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Marketing audit · 5 checks
        </p>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-primary-strong">
          Free
        </span>
      </div>
      <div className="grid gap-2">
        {AUDIT_CHECKS.map((check) => (
          <FailRow key={check.label} label={check.label} finding={check.finding} />
        ))}
      </div>
      <div className="border-t border-border/50 pt-3.5">
        <Meter label="Where this truck stands today" pct={34} />
      </div>
    </VisualCard>
  );
}

function PreviewCard() {
  return (
    <VisualCard label="Example: the live preview we screen share on the audit call">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-background/40">
        <div className="flex items-center gap-1.5 border-b border-border/60 px-3 py-2">
          {[0, 1, 2].map((dot) => (
            <span key={dot} className="size-2 rounded-full bg-muted-foreground/30" />
          ))}
          <span className="ml-2 truncate font-mono text-[10px] text-muted-foreground">
            your-truck.com
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <LiveDot />
            <span className="font-mono text-[10px] text-primary-strong">on the call</span>
          </span>
        </div>
        <div className="grid gap-2 p-3.5">
          <div className="h-2.5 w-2/3 rounded-full bg-primary/40" />
          <div className="h-2 w-5/6 rounded-full bg-muted-foreground/20" />
          <div className="mt-1 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((tile) => (
              <div
                key={tile}
                className="h-10 rounded-lg border border-primary/20 bg-primary/[0.06]"
              />
            ))}
          </div>
        </div>
      </div>
      <CardRow icon={Check} text="Two or three options, priced. You pick." />
      <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/[0.07] p-3">
        <span className="flex-1 text-sm font-medium text-foreground">
          Paid so far
        </span>
        <span className="font-mono text-sm tabular-nums text-primary-strong">$0.00</span>
      </div>
    </VisualCard>
  );
}

function InvoiceCard() {
  return (
    <VisualCard label="Example: the invoice, with the fifty-fifty split spelled out">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Your invoice
        </p>
        <span className="font-mono text-xs text-foreground/80">1 of 1</span>
      </div>
      <div className="grid gap-2">
        <CardRow icon={Globe} text="Website rebuild + live location map" />
        <CardRow icon={QrCode} text="QR express ordering, 0% commission" />
        <CardRow icon={Check} text="AI assistant, if you want it" />
      </div>
      <div className="grid gap-3 border-t border-border/50 pt-3.5">
        <div className="flex items-center justify-between text-sm">
          <span className="text-foreground/85">Due to start the build</span>
          <span className="font-mono tabular-nums text-primary-strong">50%</span>
        </div>
        <Bar pct={50} />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Due after it is live</span>
          <span className="font-mono tabular-nums text-muted-foreground">50%</span>
        </div>
      </div>
    </VisualCard>
  );
}

function BuildCard() {
  return (
    <VisualCard label="Example: build progress during week two">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Build progress
        </p>
        <span className="font-mono text-xs tabular-nums text-foreground/80">Day 9 of 14</span>
      </div>
      <Bar pct={64} />
      <div className="grid gap-2 pt-1">
        <CardRow icon={QrCode} text="Express QR menu: live on staging" />
        <CardRow icon={ArrowLeftRight} text="Square sync: test orders flowing" />
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
            <LiveDot />
          </span>
          <span className="text-sm text-foreground/85">Catering funnel: in review with you</span>
        </div>
      </div>
    </VisualCard>
  );
}

function LaunchCard() {
  return (
    <VisualCard label="Example: launch-day checklist">
      <CardRow icon={QrCode} text="QR signage up: window and pickup shelf" />
      <CardRow icon={Globe} text="Custom Domain flipped: zero downtime" />
      <div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-primary/[0.07] p-3">
        <LiveDot />
        <span className="flex-1 text-sm font-medium text-foreground">
          First online order · 11:02 AM
        </span>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[11px] tabular-nums text-foreground/80">
          +$41.50
        </span>
      </div>
    </VisualCard>
  );
}

/* ---------------------------------------------------------------------- */
/* Phases                                                                  */

interface Phase {
  num: string;
  kicker: string;
  icon: IconType;
  days: string;
  title: string;
  body: string;
  deliverables: string[];
  visual: React.ReactNode;
}

const PHASES: Phase[] = [
  {
    num: "01",
    kicker: "Free Marketing Audit",
    icon: ClipboardList,
    days: "Free · No call needed",
    title: "Say yes and we audit your whole setup. Free.",
    body: "Nothing to install, nothing to pay, no call to sit through to get it. Everything we look at is already public, so we do the digging on our own time. You get a straight list of what is costing you customers, worst first.",
    deliverables: [
      "Google Business Profile: found, or invisible?",
      "Photos and posts: are they selling your food?",
      "Your website: speed, phone, and whether it converts",
      "Ads: what you could run on TikTok, Instagram, Facebook",
      "AI: what you could automate today and are not",
    ],
    visual: <AuditCard />,
  },
  {
    num: "02",
    kicker: "The Audit Call",
    icon: Monitor,
    days: "Free · 30 minutes",
    title: "We walk your audit. Then we show you what we already built.",
    body: "Thirty minutes. We go through every leak, worst first, and tell you exactly what we would fix. Then we share our screen: your truck, on a modern site, running live. We built it before the call, on our own time, before you paid us anything. If you like it, we talk options and prices.",
    deliverables: [
      "Every leak walked through, worst first",
      "Your modernized site on screen, running live",
      "Two or three options, priced. No pressure to pick one",
    ],
    visual: <PreviewCard />,
  },
  {
    num: "03",
    kicker: "The Closing Call",
    icon: FileText,
    days: "50% to start",
    title: "One call, one invoice, nothing buried.",
    body: "Pick your option and we get on a short call to lock it in. One document: full scope, timeline, price. Half starts the build and holds your slot. The other half is not due until your site is live and taking orders. No retainer, no surprise line items, no lock-in.",
    deliverables: [
      "One doc: scope, timeline, and price in plain English",
      "50% to start, 50% only after launch",
      "Your build slot and launch date locked in writing",
    ],
    visual: <InvoiceCard />,
  },
  {
    num: "04",
    kicker: "Onboarding & Build",
    icon: Blocks,
    days: "Days 1 to 13",
    title: "You get a checklist. We do everything else.",
    body: "The day your deposit lands you get an onboarding doc: exactly what we need from you, when we need it, and the calls to be on. Usually it is menu pics, your schedule, and POS access. Then we build around your real menu and wire it into Square, Clover, or Toast.",
    deliverables: [
      "Onboarding doc: your steps and your call times, dated",
      "Build on your real menu, synced to your POS",
      "AI assistant trained on your menu, texted from your phone",
    ],
    visual: <BuildCard />,
  },
  {
    num: "05",
    kicker: "Launch & Upkeep",
    icon: Rocket,
    days: "Day 14",
    title: "Live before the weekend rush.",
    body: "Domain flipped with zero downtime, QR signage at the window, first orders landing. That is when the second half is due: after it works, not before. From there, $50 a month keeps the site, the AI, and the updates running. Cancel whenever.",
    deliverables: [
      "Everything live and taking orders on day 14",
      "Final 50% due after launch, not before",
      "$50/month upkeep: site, AI, and fixes. No contract",
    ],
    visual: <LaunchCard />,
  },
];

/* ---------------------------------------------------------------------- */
/* Timeline                                                                */

export function ProcessTimeline() {
  const reduceMotion = !!useReducedMotion();
  const railRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.75", "end 0.45"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <div ref={railRef} className="relative">
      {/* Rail: static track + scroll-drawn fill (with a soft glow underlay) */}
      <div aria-hidden className="absolute bottom-4 left-[13px] top-4 w-px bg-border/60" />
      <motion.div
        aria-hidden
        className="absolute bottom-4 left-[13px] top-4 w-0.5 origin-top -translate-x-px rounded-full bg-primary/30 blur-[2px]"
        style={{ scaleY: reduceMotion ? 1 : scaleY }}
      />
      <motion.div
        aria-hidden
        className="absolute bottom-4 left-[13px] top-4 w-px origin-top bg-primary"
        style={{ scaleY: reduceMotion ? 1 : scaleY }}
      />

      <ol className="grid gap-16 sm:gap-20">
        {PHASES.map((phase, i) => (
          <React.Fragment key={phase.num}>
            <li id={`phase-${i + 1}`} className="relative scroll-mt-24 pl-12 sm:pl-16">
              <span
                aria-hidden
                className="absolute left-0 top-0 flex size-7 items-center justify-center rounded-full border border-primary/40 bg-background font-mono text-[11px] text-primary shadow-[0_0_0_4px_rgb(var(--glow)/0.10)]"
              >
                {phase.num}
              </span>
              <Reveal>
                <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
                  <div className="grid gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                        <span className="text-primary-strong">{phase.num}</span>
                        {phase.kicker}
                        <phase.icon className="size-3.5 text-primary/70" />
                      </p>
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-primary-strong">
                        {phase.days}
                      </span>
                    </div>
                    <h2 className="font-display text-title-sm text-balance text-foreground">
                      {phase.title}
                    </h2>
                    <p className="text-base leading-7 text-muted-foreground">{phase.body}</p>
                    <ul className="grid gap-2.5 pt-1">
                      {phase.deliverables.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5 text-sm text-foreground/85"
                        >
                          <CheckCircle2 className="size-4 shrink-0 text-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>{phase.visual}</div>
                </div>
              </Reveal>
            </li>

            {/* The $0 gate sits after the strategy call — the last moment a
                truck can walk having spent nothing. The one warm amber accent
                against the sage system. */}
            {i === 1 && (
              <li className="relative pl-12 sm:pl-16" aria-label="The zero-dollar gate">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 flex size-7 items-center justify-center rounded-full border border-accent-warm/50 bg-accent-warm/15 shadow-[0_0_0_4px_rgb(var(--glow)/0.10)]"
                >
                  <ShieldCheck className="size-3.5 text-accent-warm" />
                </span>
                <Reveal>
                  <div className="grid gap-1.5 rounded-2xl border border-dashed border-accent-warm/40 bg-accent-warm/[0.06] p-5">
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary-strong">
                      The $0 gate
                    </p>
                    <p className="text-sm leading-6 text-foreground/85">
                      By here you have seen every leak, every price, and your new
                      site running. You still have not paid a dollar. Walk away at
                      this line and it costs you nothing.
                    </p>
                  </div>
                </Reveal>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </div>
  );
}
