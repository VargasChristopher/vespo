import type { Variants } from "framer-motion";

/* Shared motion constants. These consolidate values that were previously
   re-declared across 6+ components (the spring, the reveal viewport). */

/** Site-wide hover/tap micro-interaction spring. */
export const SPRING = { type: "spring", stiffness: 300, damping: 25 } as const;
/** Soft follow — magnetic returns, rails, layout pills. */
export const SPRING_SOFT = { type: "spring", stiffness: 120, damping: 30 } as const;
/** Snappy step slides — pricing quiz, audit funnel. */
export const SPRING_SLIDE = { type: "spring", stiffness: 260, damping: 30 } as const;

/** Expressive cubic-bezier ease-out (framer + GSAP-friendly). */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const DUR = { xs: 0.15, sm: 0.25, md: 0.6, lg: 0.9 } as const;

/** Canonical scroll-reveal viewport: fire once, 100px before entry. */
export const VIEWPORT_ONCE = { once: true, margin: "-100px" } as const;

/** Fade-up variants, reduced-motion aware (collapse the translate). */
export function fadeUp(
  reduce: boolean,
  opts: { y?: number; delay?: number; duration?: number } = {}
): Variants {
  const { y = 24, delay = 0, duration = 0.6 } = opts;
  return {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    visible: { opacity: 1, y: 0, transition: { duration, ease: "easeOut", delay } },
  };
}

/** Stagger container variants for cascading child reveals. */
export function staggerParent(
  opts: { stagger?: number; delay?: number } = {}
): Variants {
  const { stagger = 0.12, delay = 0.1 } = opts;
  return {
    hidden: {},
    visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
}

/** GSAP scene conventions (ScrollTrigger scrubs / orchestration). */
export const G = {
  ease: "power3.out",
  easeLine: "power4.out",
  dur: 0.9,
  stagger: 0.09,
  scrub: 0.6,
} as const;
