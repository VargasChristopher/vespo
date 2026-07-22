"use client";

import * as React from "react";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { gsap, useGSAP } from "@/lib/gsap";

export interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /** [fromY, toY] px translation as the element scrolls through the viewport. */
  y?: [number, number];
  /** Only run at/above this min width (px). Default 768. */
  minWidth?: number;
}

/* Scrubbed vertical parallax. Desktop-only via matchMedia and skipped
   entirely under reduced motion. Transform-only (composited). */
export function Parallax({
  children,
  className,
  y = [30, -30],
  minWidth = 768,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduce || !el) return;

      const mm = gsap.matchMedia();
      mm.add(`(min-width: ${minWidth}px)`, () => {
        gsap.fromTo(
          el,
          { y: y[0] },
          {
            y: y[1],
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });

      return () => mm.revert();
    },
    { scope: ref, dependencies: [reduce] }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
