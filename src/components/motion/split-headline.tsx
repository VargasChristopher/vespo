"use client";

import * as React from "react";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { G } from "@/lib/motion";

type Tag = "h1" | "h2" | "h3";

export interface SplitHeadlineProps {
  children: React.ReactNode;
  as?: Tag;
  className?: string;
  delay?: number;
  stagger?: number;
  /** Play when scrolled into view (top 80%) instead of on mount. */
  scrollTrigger?: boolean;
}

/* Line-by-line headline reveal: SplitText splits into lines that fade and
   rise into place. No overflow mask — a clip crops the display serif's deep
   descenders (g/y/p). autoSplit re-runs on resize/font-load; aria:"auto"
   keeps the full sentence in the accessibility tree. Reduced motion → plain
   heading. */
export function SplitHeadline({
  children,
  as = "h2",
  className,
  delay = 0,
  stagger = G.stagger,
  scrollTrigger = false,
}: SplitHeadlineProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const reduce = !!useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduce || !el) return;

      const split = SplitText.create(el, {
        type: "lines",
        autoSplit: true,
        aria: "auto",
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 40,
            autoAlpha: 0,
            duration: 1,
            ease: G.easeLine,
            stagger,
            delay,
            ...(scrollTrigger
              ? { scrollTrigger: { trigger: el, start: "top 80%", once: true } }
              : {}),
          }),
      });

      return () => {
        split.revert();
      };
    },
    { scope: ref, dependencies: [reduce] }
  );

  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
