"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  Check,
  CheckCircle2,
  ChefHat,
  CreditCard,
  MapPin,
  Megaphone,
  MessageSquare,
  RefreshCw,
  RotateCcw,
  Send,
  Zap,
} from "lucide-react";

import { Parallax } from "@/components/motion/parallax";
import { Reveal } from "@/components/reveal";
import { SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * Animation spec (.claude/rules/animation-spec.md):
 * 1. Section reveals: shared <Reveal /> (whileInView, once, -100px).
 * 2. Differential column parallax (desktop, no-preference): the copy column
 *    and the demo column drift at opposite rates for depth. GSAP owns the
 *    column wrappers; framer owns the demo hover — never the same node.
 * 3. Demo hover: y -4, scale 1.01, SPRING; border glow via classes.
 * 4. Checkout demo: AnimatePresence mode="wait", y ±16 fade, 0.25s.
 * All gated on useReducedMotion().
 */

type IconType = React.ComponentType<{ className?: string }>;

function DemoShell({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  const reduceMotion = !!useReducedMotion();
  return (
    <motion.div
      role="group"
      aria-label={label}
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={SPRING}
      className={cn(
        "grid gap-4 rounded-3xl border border-border/60 bg-card/50 p-5 shadow-glow backdrop-blur-xl transition-colors hover:border-primary/40 sm:p-6",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/* Pillar 2 demo: the local profile people find first, plus the ads        */

function SocialDemo() {
  return (
    <DemoShell label="Example: the local profile we rebuild and the ads we run behind it">
      <div className="rounded-xl border border-primary/40 bg-primary/[0.07] p-3.5">
        <div className="flex items-center gap-2">
          <MapPin className="size-3.5 shrink-0 text-primary" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-primary-strong">
            Local profile
          </span>
          <span className="ml-auto flex items-center gap-1 text-xs text-primary">
            <Check className="size-3.5" />
            Updated today
          </span>
        </div>
        <p className="mt-2 text-sm font-semibold text-foreground">
          Open now · 11a to 9p · 0.4 mi away
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((tile) => (
            <div
              key={tile}
              className="h-12 rounded-lg border border-primary/20 bg-primary/[0.06]"
            />
          ))}
        </div>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Real photos, shot this month
        </p>
      </div>

      <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
        <span className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
          <RefreshCw className="size-3.5 text-primary" />
        </span>
        <span className="text-sm text-foreground/85">
          7 posts this week. None written by you.
        </span>
      </div>

      <div className="flex items-center gap-3 border-t border-border/50 pt-3.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
          <Megaphone className="size-4 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">
            Local ad · 3 mile radius · lunch hours
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            1,240 reached · 38 tapped the menu
          </p>
        </div>
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Zap className="size-3.5" />
        </span>
      </div>
    </DemoShell>
  );
}

/* ---------------------------------------------------------------------- */
/* Pillar 1 demo: tap-through express checkout                             */

function CheckoutDemo() {
  const reduceMotion = !!useReducedMotion();
  const [stage, setStage] = React.useState(0);

  const stageVariants: Variants = {
    enter: { opacity: 0, y: reduceMotion ? 0 : 16 },
    center: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: { opacity: 0, y: reduceMotion ? 0 : -16, transition: { duration: 0.15, ease: "easeIn" } },
  };

  return (
    <DemoShell label="Interactive demo: the 10-second express checkout">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          Live demo · tap through
        </span>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-foreground/80">
          {stage < 2 ? `Tap ${stage + 1} of 3` : "≈ 10 seconds"}
        </span>
      </div>

      <div className="min-h-44">
        <AnimatePresence mode="wait" initial={false}>
          {stage === 0 && (
            <motion.div
              key="menu"
              variants={stageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid gap-3"
            >
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3.5">
                <div>
                  <p className="text-sm font-semibold text-foreground">Brisket Tacos (3)</p>
                  <p className="text-xs text-muted-foreground">Scanned from the window QR</p>
                </div>
                <span className="font-mono text-sm font-semibold text-foreground">$14.50</span>
              </div>
              <button
                type="button"
                onClick={() => setStage(1)}
                className="h-11 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-glow-lg outline-none transition-all hover:bg-primary/90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                Order ahead
              </button>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="pay"
              variants={stageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid gap-3"
            >
              <div className="grid gap-2 rounded-xl border border-border/60 bg-background/40 p-3.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Brisket Tacos (3)</span>
                  <span className="font-mono">$14.50</span>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Sales tax</span>
                  <span className="font-mono">$1.17</span>
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-2 text-sm font-semibold text-foreground">
                  <span>Total</span>
                  <span className="font-mono">$15.67</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStage(2)}
                className="flex h-11 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background outline-none transition-opacity hover:opacity-90 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <CreditCard className="size-4" />
                One Tap Pay · $15.67
              </button>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="done"
              variants={stageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid justify-items-center gap-2.5 py-2 text-center"
            >
              <span className="flex size-11 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
                <Check className="size-5 text-primary" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">Order #117 confirmed</p>
                <p className="text-xs text-muted-foreground">Skip the line · ready in 8 minutes</p>
              </div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/80">
                0% commission
              </span>
              <button
                type="button"
                onClick={() => setStage(0)}
                className="mt-1 flex items-center gap-1.5 rounded-full text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <RotateCcw className="size-3" />
                Run it again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DemoShell>
  );
}

/* ---------------------------------------------------------------------- */
/* Pillar 3 demo: the owner's text thread with the AI assistant             */

const THREAD: { from: "owner" | "ai"; text: string }[] = [
  { from: "owner", text: "parked at 1200 E 6th til 9 tonight" },
  { from: "ai", text: "Updated. Live map, hours, and both socials are live." },
  { from: "owner", text: "draft a post, brisket is back" },
  { from: "ai", text: "“Brisket is back. 1200 E 6th til 9.” Reply OK and I’ll send it." },
];

function AssistantDemo() {
  return (
    <DemoShell label="Example: an owner texting the Vespo AI assistant, and the catering lead it chased">
      <div className="flex items-center gap-2.5 border-b border-border/50 pb-3.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/15">
          <MessageSquare className="size-4 text-primary" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            Vespo Assistant
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            Text thread · 7:02 AM
          </p>
        </div>
      </div>

      <div className="grid gap-2.5">
        {THREAD.map((msg) => (
          <div
            key={msg.text}
            className={cn(
              "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm",
              msg.from === "owner"
                ? "ml-auto rounded-br-md border border-border/60 bg-background/40 text-foreground/75"
                : "mr-auto rounded-bl-md border border-primary/30 bg-primary/[0.07] text-foreground/90"
            )}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-border/50 pt-3.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
          <ChefHat className="size-4 text-primary" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-foreground">
            Catering inquiry · corporate lunch, 45 people
          </p>
          <p className="font-mono text-[11px] text-muted-foreground">
            $1,350 est. · AI reply sent in 2 min
          </p>
        </div>
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <Send className="size-3.5" />
        </span>
      </div>
    </DemoShell>
  );
}

/* ---------------------------------------------------------------------- */
/* Pillars                                                                 */

interface Pillar {
  id: string;
  num: string;
  kicker: string;
  icon: IconType;
  title: string;
  body: string;
  features: string[];
  demo: React.ReactNode;
  flip?: boolean;
}

const PILLARS: Pillar[] = [
  {
    id: "websites",
    num: "01",
    kicker: "Websites",
    icon: MapPin,
    title: "A site that shows today’s spot and takes the order.",
    body: "A modern rebuild with a live location map synced from your Instagram posts, so fans find today’s spot in one tap. Then a QR code at the window turns your menu into a checkout. Apple Pay, Google Pay, and every dollar stays in your bank.",
    features: [
      "Live park map updated the second you post",
      "Menu loads in under 0.8s on any phone",
      "QR express checkout at 0% commission, forever",
      "Orders route to your existing POS or kitchen printer",
    ],
    demo: <CheckoutDemo />,
  },
  {
    id: "social",
    num: "02",
    kicker: "Social Media Marketing",
    icon: Megaphone,
    title: "The first thing they find should sell your food.",
    body: "We rebuild the profile people hit first: real photos of your food, current hours, the right categories. Then we keep your feeds moving and run local ads on TikTok, Instagram, and Facebook, pointed at people a few miles from your window instead of the whole state.",
    features: [
      "Google Business Profile rebuilt: photos, hours, categories",
      "Posts that look like your food, not stock plates",
      "Local ads on TikTok, Instagram, and Facebook",
    ],
    demo: <SocialDemo />,
    flip: true,
  },
  {
    id: "ai",
    num: "03",
    kicker: "AI Automation",
    icon: MessageSquare,
    title: "Run your whole site from a text message.",
    body: "Text your assistant today’s address and the live map updates in seconds. Send a photo of the special and it writes the post. Ask it to chase a catering lead. No dashboard, no login, no laptop in the truck.",
    features: [
      "Text today’s address, the live map updates in seconds",
      "Send a menu photo, it drafts the post for your OK",
      "Ask it to reply to DMs, reviews, and catering leads",
    ],
    demo: <AssistantDemo />,
  },
];

export function ServicePillars() {
  return (
    <div className="grid gap-20 sm:gap-24">
      {PILLARS.map((pillar) => (
        <section key={pillar.id} id={pillar.id} className="scroll-mt-24">
          <Reveal>
            {/* min-w-0 on both columns is load-bearing. Grid items default to
                min-width:auto, so a column refuses to shrink below its content's
                intrinsic width — the demo cards have wide flex rows, which pushed
                the page 8px past the viewport on a 390px phone and made the whole
                site scroll sideways. */}
            <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <Parallax
                y={[16, -16]}
                className={cn(
                  "relative isolate grid min-w-0 gap-5",
                  pillar.flip && "lg:order-2"
                )}
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -left-1 -top-9 -z-10 select-none font-display text-[clamp(5rem,9vw,8rem)] leading-none text-primary/[0.06]"
                >
                  {pillar.num}
                </span>
                <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  {pillar.kicker}
                  <pillar.icon className="size-3.5 text-primary/70" />
                </p>
                <h2 className="font-display text-title-sm text-balance text-foreground">
                  {pillar.title}
                </h2>
                <p className="text-base leading-7 text-muted-foreground">{pillar.body}</p>
                <ul className="grid gap-2.5">
                  {pillar.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 text-sm text-foreground/85">
                      <CheckCircle2 className="size-4 shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </Parallax>
              <Parallax
                y={[-16, 16]}
                className={cn("min-w-0", pillar.flip && "lg:order-1")}
              >
                {pillar.demo}
              </Parallax>
            </div>
          </Reveal>
        </section>
      ))}
    </div>
  );
}
