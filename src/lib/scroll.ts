import type Lenis from "lenis";

/** Fixed-header offset for anchor + programmatic scrolls (h-16 + breathing).
    Shared by the Lenis `anchors` option and scrollToTarget so hash links and
    JS scrolls land at the same place. Mirrors scroll-pt-24 for the native
    fallback path. */
export const HEADER_OFFSET = -96;

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Scroll to an element / selector / y-offset with the header accounted for.
 * Prefers Lenis (smooth) when active; otherwise native window scroll —
 * instant under reduced motion, smooth elsewhere. Centralizes the contact
 * quiz's programmatic scrolls so behavior stays consistent with anchors.
 */
export function scrollToTarget(
  target: HTMLElement | string | number,
  opts: { offset?: number } = {}
) {
  const offset = opts.offset ?? HEADER_OFFSET;

  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(target, { offset });
    return;
  }

  if (typeof window === "undefined") return;
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const behavior: ScrollBehavior = prefersReduced ? "auto" : "smooth";

  if (typeof target === "number") {
    window.scrollTo({ top: target + offset, behavior });
    return;
  }
  const el =
    typeof target === "string"
      ? document.querySelector<HTMLElement>(target)
      : target;
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, behavior });
}
