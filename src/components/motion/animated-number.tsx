"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const NUM_RE = /^(\D*)([\d,]+(?:\.\d+)?)(.*)$/;

function parse(value: string) {
  const m = value.match(NUM_RE);
  if (!m) return null;
  const raw = m[2];
  return {
    prefix: m[1],
    suffix: m[3],
    decimals: raw.includes(".") ? raw.split(".")[1].length : 0,
    hasComma: raw.includes(","),
    target: parseFloat(raw.replace(/,/g, "")),
  };
}

export interface AnimatedNumberProps {
  value: string;
  className?: string;
  duration?: number;
}

/* Counts up the numeric part of a label ("+340%", "$4,200/mo", "18 Days").
   Values with no number ("#1 Local") render verbatim. Static under reduced
   motion; tabular-nums keeps digits from reflowing while counting. */
export function AnimatedNumber({
  value,
  className,
  duration = 1.2,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = !!useReducedMotion();
  const parsed = useMemo(() => parse(value), [value]);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parsed || reduce || !inView) {
      setDisplay(value);
      return;
    }
    const { prefix, suffix, decimals, hasComma, target } = parsed;
    const format = (v: number) =>
      hasComma
        ? v.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : v.toFixed(decimals);
    setDisplay(`${prefix}${format(0)}${suffix}`);
    const controls = animate(0, target, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(`${prefix}${format(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [parsed, reduce, inView, value, duration]);

  if (!parsed) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {display}
    </span>
  );
}
