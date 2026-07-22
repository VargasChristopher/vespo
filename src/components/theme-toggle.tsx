"use client";

import { useState, useEffect, useId } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

/*
 * Skiper4 ThemeToggleButton2 adapted for Vespo theme switching
 * URL: https://skiper-ui.com/v1/skiper4
 *
 * Sun (light) ⇄ crescent moon (dark). Two things here are load-bearing:
 * 1. The clip path is applied to the DISC ONLY. It exists to bite a crescent
 *    out of the circle in dark mode; the rays must never be inside it, or a
 *    clip that resolves late/offset takes the whole sun with it and you get a
 *    featureless dot.
 * 2. Before hydration we cannot know the theme, so we render the light-mode
 *    sun (the site default) rather than a placeholder circle — a bare dot is
 *    indistinguishable from the icon being broken.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  /* Unique per instance — the navbar renders one toggle for desktop and one
     inside the mobile menu, and duplicate SVG ids would cross-reference. */
  const clipId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && (theme === "dark" || resolvedTheme === "dark");
  const ease = { ease: "easeInOut", duration: 0.35 } as const;

  return (
    <button
      type="button"
      aria-label="Toggle light and dark mode"
      className={cn(
        "flex size-9 items-center justify-center rounded-full transition-all duration-300 active:scale-95 border border-border/40 shadow-sm",
        isDark
          ? "bg-primary/20 text-foreground hover:border-primary/60"
          : "bg-background text-foreground hover:border-primary/60",
        className
      )}
      onClick={() => {
        if (mounted) setTheme(isDark ? "light" : "dark");
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        fill="currentColor"
        strokeLinecap="round"
        viewBox="0 0 32 32"
        className="size-5"
      >
        <clipPath id={clipId}>
          <motion.path
            initial={false}
            animate={{ y: isDark ? 10 : 0, x: isDark ? -12 : 0 }}
            transition={ease}
            d="M0-5h30a1 1 0 0 0 9 13v24H0Z"
          />
        </clipPath>

        {/* The disc: grows and gets the crescent bitten out of it in dark. */}
        <motion.circle
          clipPath={`url(#${clipId})`}
          initial={false}
          animate={{ r: isDark ? 10 : 8 }}
          transition={ease}
          cx="16"
          cy="16"
          r={isDark ? 10 : 8}
          fill="currentColor"
        />

        {/* The rays: unclipped, so they can only ever be hidden on purpose. */}
        <motion.g
          initial={false}
          animate={{
            rotate: isDark ? -100 : 0,
            scale: isDark ? 0.5 : 1,
            opacity: isDark ? 0 : 1,
          }}
          transition={ease}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
        >
          <path d="M16 5.5v-4" />
          <path d="M16 30.5v-4" />
          <path d="M1.5 16h4" />
          <path d="M26.5 16h4" />
          <path d="m23.4 8.6 2.8-2.8" />
          <path d="m5.7 26.3 2.9-2.9" />
          <path d="m5.8 5.8 2.8 2.8" />
          <path d="m23.4 23.4 2.9 2.9" />
        </motion.g>
      </svg>
    </button>
  );
}
