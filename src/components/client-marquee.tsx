import {
  Bot,
  MapPin,
  Megaphone,
  Percent,
  Sparkles,
  Timer,
  Truck,
  Zap,
} from "lucide-react";

import { Marquee } from "@/components/ui/marquee";

/*
 * Trust-badge ticker (Magic UI Marquee, CSS keyframe animation).
 * Pure CSS loop: pauses on hover, and motion-reduce renders it static
 * (handled inside the Marquee primitive). Edge fades blend the strip into
 * the site background in both light and dark themes.
 */

const badges = [
  { icon: MapPin, label: "Live Park Schedules" },
  { icon: Megaphone, label: "Daily Posts & Local Ads" },
  { icon: Sparkles, label: "Text Your AI Assistant" },
  { icon: Zap, label: "Skip-the-Line Ordering" },
  { icon: Percent, label: "Zero DoorDash Commissions" },
  { icon: Timer, label: "14-Day Turnaround" },
  { icon: Bot, label: "AI Answers Your DMs" },
  { icon: Truck, label: "Austin Born, Nationwide Scale" },
];

export function ClientMarquee() {
  return (
    <section
      aria-label="Why food trucks choose Vespo"
      className="relative border-y border-border/60 bg-card/20 py-3 backdrop-blur-sm"
    >
      <Marquee pauseOnHover className="[--duration:32s] [--gap:3rem]">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground"
          >
            <badge.icon className="size-4 shrink-0 text-primary-strong" />
            <span className="whitespace-nowrap">{badge.label}</span>
          </div>
        ))}
      </Marquee>

      {/* Edge fades so the loop dissolves into the background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent sm:w-40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent sm:w-40"
      />
    </section>
  );
}
