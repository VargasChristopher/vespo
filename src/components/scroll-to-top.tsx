"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";

import { SPRING } from "@/lib/motion";
import { scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/*
 * Back-to-top button. Mounted globally in layout.tsx, so it is on every route.
 *
 * It stays hidden until you are past the fold (matching the navbar's own
 * passive scroll listener pattern) — a back-to-top control sitting over the
 * hero has nothing to go back to. Scrolling routes through the shared
 * scrollToTarget helper, so it is smooth under Lenis and instant under
 * prefers-reduced-motion, same as the nav links and anchors.
 *
 * Motion: entrance/exit via AnimatePresence (fade + scale + rise), hover lift
 * and tap press on SPRING. All of it collapses to a plain fade under
 * prefers-reduced-motion.
 */
export function ScrollToTop({ className }: { className?: string }) {
  const reduce = !!useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Scroll back to top"
          onClick={() => scrollToTarget(0, { offset: 0 })}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
          transition={reduce ? { duration: 0 } : SPRING}
          whileHover={reduce ? undefined : { y: -3, scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.94 }}
          className={cn(
            /* Same sage as the primary CTA: bg-primary + ink-on-sage label. */
            "fixed bottom-6 right-6 z-40 flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow-lg outline-none transition-shadow duration-300 hover:shadow-glow-xl focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:bottom-8 sm:right-8",
            className
          )}
        >
          <ArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
