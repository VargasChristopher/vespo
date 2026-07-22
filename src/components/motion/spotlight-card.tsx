"use client";

import * as React from "react";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Radius of the pointer glow in px. */
  radius?: number;
}

/* Pointer-tracked border glow. The pointer position is written to CSS
   custom props (no React re-render); a masked overlay lights only the
   rounded rim where the cursor is. Inert under reduced motion / touch. */
export function SpotlightCard({
  children,
  className,
  radius = 260,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();

  function handleMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div
      ref={ref}
      onPointerMove={reduce ? undefined : handleMove}
      className={cn("group/spot relative", className)}
    >
      {!reduce && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
          style={
            {
              background: `radial-gradient(${radius}px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgb(var(--glow) / 0.6), transparent 65%)`,
              padding: "1.5px",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              maskComposite: "exclude",
            } as React.CSSProperties
          }
        />
      )}
      {children}
    </div>
  );
}
