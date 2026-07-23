"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

/*
 * Animation spec (.claude/rules/animation-spec.md):
 * 1. Canopy light leaks — Trigger: infinite loop. Target: two ultra-diffused
 *    blooms (sage primary top-center, olive bottom-left). Effect: opacity breathe
 *    0.2→0.35→0.2 (+ scale 1→1.08) over 14s / 0.12→0.22→0.12 over 16s,
 *    easeInOut, repeat Infinity.
 * 2. Everything else is intentionally static: velvet radial wash, three canopy
 *    god rays, matte grain overlay, emblem watermark. Under prefers-reduced-motion
 *    the leaks hold their midpoint opacity with no animation.
 *
 * MOBILE (<768px): every blurred layer below is `hidden md:block`. This element
 * is position:fixed, so it never scrolls off, and a 640px box with a 180px blur
 * needs roughly a 1720² texture — times six layers, three of them animating
 * forever, with ~24 backdrop-blur surfaces stacked on top re-reading it every
 * frame. That combination exhausts the renderer's memory budget on a phone and
 * Chrome kills the tab. The wash, vignette, and grain carry the look on mobile;
 * they are plain gradients and cost nothing.
 */

/* SVG fractal-noise grain; dithers the radial wash to kill gradient banding */
const GRAIN_URL = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function BotanicalBackground({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-background",
        className
      )}
    >
      {/* Velvet base wash — warm paper in light, forest obsidian in dark */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#ffffff_0%,#f8f7f4_40%,#f0eee7_75%,#e6e4da_100%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,#1a2a1e_0%,#10160f_45%,#0b0f0c_80%,#060806_100%)]" />

      {/* Canopy god rays — three static angled light shafts from the top, as if
          sun were cutting through leaves. Conic slivers, heavily blurred. */}
      <div
        className="absolute -top-24 left-[14%] hidden md:block h-[40rem] w-[6rem] -rotate-[12deg] bg-gradient-to-b from-chart-3/10 via-chart-3/3 to-transparent blur-[68px]"
        style={{ transformOrigin: "top center" }}
      />
      <div
        className="absolute -top-24 left-[30%] hidden md:block h-[42rem] w-[7rem] -rotate-[18deg] bg-gradient-to-b from-primary/12 via-primary/4 to-transparent blur-[64px]"
        style={{ transformOrigin: "top center" }}
      />
      <div
        className="absolute -top-24 left-[52%] hidden md:block h-[36rem] w-[5rem] -rotate-[26deg] bg-gradient-to-b from-chart-2/10 via-chart-2/3 to-transparent blur-[72px]"
        style={{ transformOrigin: "top center" }}
      />

      {/* Ambient canopy light leaks */}
      <motion.div
        className="absolute -top-40 left-1/2 hidden md:block size-[50rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/25 via-chart-3/10 to-transparent blur-[160px]"
        animate={
          reduceMotion
            ? { opacity: 0.28 }
            : { opacity: [0.2, 0.35, 0.2], scale: [1, 1.08, 1] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 14, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <motion.div
        className="absolute -bottom-32 -left-20 hidden md:block size-[40rem] rounded-full bg-chart-2/10 blur-[180px]"
        animate={
          reduceMotion ? { opacity: 0.17 } : { opacity: [0.12, 0.22, 0.12] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 16, repeat: Infinity, ease: "easeInOut", delay: 2 }
        }
      />
      <motion.div
        className="absolute -bottom-48 -right-32 hidden md:block size-[34rem] rounded-full bg-chart-3/10 blur-[170px]"
        animate={
          reduceMotion ? { opacity: 0.15 } : { opacity: [0.1, 0.2, 0.1] }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 18, repeat: Infinity, ease: "easeInOut", delay: 7 }
        }
      />

      {/* Elegant emblem watermark — static, majestic, whisper-quiet.
          573 = width 600 at the art's true 155:148 aspect (Next.js warns
          when the attributes don't match the rendered box). */}
      <Image
        src="/assets/vespo_monochrome.png"
        alt=""
        width={600}
        height={573}
        preload
        style={{ height: "auto" }}
        className="pointer-events-none absolute -right-32 top-1/3 hidden md:block select-none opacity-[0.015] blur-[1px] dark:brightness-0 dark:invert"
      />

      {/* Velvet vignette — darkens the corners so content glows at center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.06)_100%)] dark:bg-[radial-gradient(ellipse_90%_90%_at_50%_45%,transparent_55%,rgba(0,0,0,0.45)_100%)]" />

      {/* Matte grain overlay (velvet texture, anti-banding) */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: GRAIN_URL }}
      />
    </div>
  );
}
