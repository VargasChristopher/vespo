# Rule: Spec-First Animation Architecture (Framer Motion + GSAP + Lenis)

When building animations, micro-interactions, or scroll effects for Vespo (`vespo.io`), apply Spec-First architecture and reuse the shared motion layer. Two engines, one rule for which owns what.

## 1. The Spec-First Formula
Every animation defines three things before implementation:
1. **Trigger** — `initial/animate` entrance, `whileHover`/`whileTap`, `whileInView`, GSAP `useGSAP` timeline, or ScrollTrigger scrub.
2. **Target** — the exact element (hero line, bento card, VS coin, score ring).
3. **Effect & Physics** — exact values (`yPercent: 110`, `opacity: [0,1]`, `scale: 1.02`, a named spring).

## 2. Shared motion layer — import, don't redeclare
- **`src/lib/motion.ts`**: `SPRING` (300/25, hover/tap), `SPRING_SOFT` (120/30, magnetic/rails), `SPRING_SLIDE` (260/30, step slides), `EASE_OUT_EXPO`, `DUR`, `VIEWPORT_ONCE` (`{ once, margin: "-100px" }`), `fadeUp()`, `staggerParent()`, and `G` (GSAP `ease`/`dur`/`stagger`/`scrub` conventions). Never re-declare the spring inline.
- **`src/lib/gsap.ts`**: the single plugin-registration point (`gsap`, `ScrollTrigger`, `SplitText`, `useGSAP`). Import gsap only from here.

## 3. Engine ownership rule (critical)
- **Framer Motion** owns micro-interactions: `whileHover`/`whileTap`, `AnimatePresence` step machines, `layoutId` pills, entrance reveals, ambient loops.
- **GSAP (`useGSAP` + ScrollTrigger)** owns scroll scenes: masked headline reveals, parallax scrubs, the pinned comparison, orchestrated hero entrance.
- **Never animate the same DOM node with both.** When both are needed, framer goes on an **inner** node and GSAP on the **outer** wrapper (see `comparison-section.tsx`, `service-pillars.tsx`).
- All GSAP lives inside `useGSAP(() => { … }, { scope })` for auto-cleanup. Breakpoint/motion gating uses `gsap.matchMedia().add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", …)`.

## 4. Smooth scroll (Lenis)
`src/components/motion/smooth-scroll.tsx` drives Lenis off the GSAP ticker (`lenis.on('scroll', ScrollTrigger.update)`; `gsap.ticker.add(t => lenis.raf(t*1000))`; `lagSmoothing(0)`). It **does not instantiate Lenis** under `prefers-reduced-motion: reduce` or `(pointer: coarse)` — native scroll there. Anchor + programmatic scrolls go through `scrollToTarget()` / `HEADER_OFFSET` in `src/lib/scroll.ts` (single source for the fixed-header offset). Do not re-add `scroll-smooth` to `<html>`.

## 5. Reusable primitives (`src/components/motion/*` + `reveal.tsx`)
`Reveal` / `RevealStagger` / `RevealItem` (scroll fade-up), `SplitHeadline` (SplitText masked line reveal, `aria:"auto"`), `Parallax` (desktop scrub), `Magnetic` (pointer follow, off on touch/reduced), `SpotlightCard` (pointer rim glow, zero re-render via CSS vars), `AnimatedNumber` (count-up). Reach for these before writing new motion.

## 6. Mandatory patterns
- **Ambient orbs**: `FloatingOrb` / `BotanicalBackground` breathing loops (already gated).
- **Card hover**: `whileHover={{ y: -4, scale: 1.01 }}` + `SPRING`; sage border/glow intensifies via `group-hover:` classes.
- **Scroll reveal**: `<Reveal>` (defaults reproduce y 30→0, 0.6s easeOut, once/-100px).
- **Headline reveal**: `<SplitHeadline as="h2" scrollTrigger>` for section headers; a bespoke `useGSAP` timeline for the hero.

## 7. Accessibility (`prefers-reduced-motion`) — non-negotiable
Every effect degrades to a static render. Use framer `useReducedMotion()` for framer code, `gsap.matchMedia` `no-preference` conditions for GSAP, and author content **visible** (GSAP `.from()` so no-JS/reduced-motion shows the final state with no flash). A global CSS kill-switch in `globals.css` covers CSS animations. BorderBeam returns `null` under reduced motion.

## 8. Documentation lookup (`context7`)
For advanced Framer Motion (`layoutId`, `AnimatePresence`, `useScroll`) or GSAP (`SplitText`, `ScrollTrigger` pinning, `matchMedia`) syntax, query the `context7` MCP server first if unsure.
