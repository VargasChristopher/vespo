"use client";

import { motion, useReducedMotion } from "framer-motion";

/*
 * Floating botanical orb (.claude/rules/animation-spec.md §2):
 * Trigger: infinite loop. Target: blurred background orb. Effect: y [0,-15,0],
 * opacity [0.3,0.6,0.3], easeInOut, repeat Infinity. Static at 0.35 opacity
 * under prefers-reduced-motion.
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
      className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
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
