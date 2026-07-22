"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { SPRING_SOFT } from "@/lib/motion";

export interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  /** Max pointer-follow offset in px. */
  strength?: number;
}

/* Pointer-follow magnetism with a soft spring return. Falls back to a plain
   wrapper under reduced motion; ignores coarse pointers (touch) so it never
   jitters mid-tap. */
export function Magnetic({ children, className, strength = 8 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const coarse = useRef(false);
  const reduce = !!useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING_SOFT);
  const sy = useSpring(y, SPRING_SOFT);

  useEffect(() => {
    coarse.current = window.matchMedia("(pointer: coarse)").matches;
  }, []);

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || coarse.current) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const clamp = (v: number) => Math.max(-strength, Math.min(strength, v));
    x.set(clamp(relX * 0.4));
    y.set(clamp(relY * 0.4));
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
