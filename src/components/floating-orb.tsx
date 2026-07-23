"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
 * Floating botanical orb (.claude/rules/animation-spec.md §2):
 * Trigger: infinite loop. Target: blurred background orb. Effect: y [0,-15,0],
 * opacity [0.3,0.6,0.3], easeInOut, repeat Infinity. Static at 0.35 opacity
 * under prefers-reduced-motion.
 *
 * Desktop only (md+). These are ~416px boxes with a 48px blur that animate
 * forever; on a phone they add composited layers to an already tight renderer
 * memory budget. Purely ambient, so mobile simply goes without.
 */
export function FloatingOrb({
  className,
  duration,
  delay = 0,
}: {
  className: string;
  duration: number;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute hidden rounded-full blur-3xl md:block ${className}`}
      animate={
        reduceMotion
          ? { opacity: 0.35 }
          : { y: [0, -15, 0], opacity: [0.3, 0.6, 0.3] }
      }
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration, repeat: Infinity, ease: "easeInOut", delay }
      }
    />
  );
}
