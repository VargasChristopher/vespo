"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { HEADER_OFFSET, setLenis } from "@/lib/scroll";

/**
 * Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in
 * sync (no double RAF loop). Renders nothing and does NOT wrap the tree in a
 * client boundary, so pages stay server components. Skipped entirely under
 * reduced motion or on coarse pointers — native scrolling is correct there.
 */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isTouch) return;

    const lenis = new Lenis({
      autoRaf: false,
      anchors: { offset: HEADER_OFFSET },
    });
    setLenis(lenis);

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const ticker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(ticker);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
