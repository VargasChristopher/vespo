# Rule: Vespo "Expensive Sage" Design System & UI Composition

When creating, modifying, or styling any component or page for Vespo (`vespo.io`), adhere to the system that is actually shipped in `src/app/globals.css` (the source of truth). Older versions of this doc described an emerald palette that was never implemented — the real brand is a muted **sage/olive on warm paper (light) / forest obsidian (dark)**. Prefer semantic Tailwind tokens (`bg-card`, `text-primary`, `border-border`) over hard-coded hexes so both themes and the dark bands stay correct.

## 1. Color tokens (defined in `globals.css`; use the utility, not the hex)
- **Primary — sage** `#7c9082` (light) / `#8fa695` (dark, brightened for AA). `text-primary`, `bg-primary`, `border-primary/40`, `ring-primary`.
- **Primary foreground — deliberate ink-on-sage** `#161c17` (white on sage fails WCAG AA; ink passes). Keep this for button labels.
- **Primary-strong — deep forest** `#3f5344` (light) / `#b8c9bb` (dark): emphasis text, mono kickers, stat numerals. `text-primary-strong`.
- **Foreground — green ink** `#1b231d` (light) / `#f2f4ee` (dark). Not blue-navy.
- **Accent-warm — amber micro-dose** `#d9a441` / `#e2b45c`: review stars (`fill-accent-warm`), the `$0 gate` only. Decorative — never body text (fails contrast on paper).
- **Backgrounds**: paper `#f8f7f4` (light) / forest obsidian `#0b0f0c` (dark); cards `#fffefb` / `#121712`; sage-tinted borders `#dcdacc` / `#253028`.
- **Glow** — `--glow` RGB triplet (`124 144 130` light) drives every sage shadow and the spotlight/beam colors. Use `rgb(var(--glow) / <alpha>)`, never a raw `rgba(124,144,130,…)` literal.
- **Gradient headline accent**: `bg-gradient-to-r from-primary via-primary-strong to-chart-3 bg-clip-text text-transparent` (sage → forest → sage).

## 2. Typography (loaded via `next/font/google` in `layout.tsx`)
- **Sora** (variable geometric sans; the `font-display` utility sets weight 600) → `--font-display`. Use `font-display` for h1/h2, pull-quotes, ghost numerals, stat numbers. Fluid sizes: `text-display` (h1), `text-title` (h2), `text-title-sm` (h3 / card titles) — tight tracking baked in. Add `text-balance`.
- **Instrument Sans** (variable, 400–700) → `--font-sans` (default body/UI). Lede text uses `text-lede`.
- **JetBrains Mono** → `font-mono` for eyebrow kickers, stats, labels (`text-[11px] uppercase tracking-[0.25em]`).

## 3. Dark "band" moments (the editorial rhythm)
Full-bleed forest sections (guarantee banner, every CTA, footer) use the `<Band>` component or a wrapper carrying **both** `data-band="dark"` and class `dark`. `globals.css` remaps the shadcn tokens to a lifted forest material, and the `dark` class makes `dark:` variant utilities fire inside (e.g. logo `dark:invert`) under both page themes. Render bands **outside** a page's `max-w-*` wrapper so they go edge-to-edge. Use `<CtaBand>` for the shared closing CTA — never re-hand-roll it.

## 4. Glassmorphism & surface styling
- Glass card: `rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl shadow-glow`.
- Emphasis card: `border-primary/40 bg-card/50 shadow-glow-md`, hover → `group-hover:border-primary/60 group-hover:shadow-glow-lg`.
- Shadow ramp (tokenized): `shadow-glow` (.12) / `shadow-glow-md` (.18) / `shadow-glow-lg` (.32) / `shadow-glow-xl` (.48). Buttons: `shadow-glow-lg hover:shadow-glow-xl`.
- Kicker chip: `rounded-full border border-primary/25 bg-card/40 shadow-glow backdrop-blur-md`. Icon tile: `rounded-lg border border-primary/30 bg-primary/15`.

## 5. UI composition
- **Never generate complex interactive UI from scratch.** Compose the vendored `src/components/ui/*` shadcn primitives + Lucide icons.
- Bento grids get `<SpotlightCard>` (pointer-tracked rim) + a ghost Fraunces numeral (`aria-hidden`, `text-primary/[0.06]`).
- `BorderBeam` defaults are tokenized (`--color-chart-2` → `--color-primary`) — call `<BorderBeam size={90} duration={9} />` with no color props.
- All shared motion primitives live in `src/components/motion/*` — see `animation-spec.md`.
