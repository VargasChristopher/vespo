@AGENTS.md

# CLAUDE.md - Vespo Design System & Rules

## Brand & Mission
- **Name**: Vespo (`vespo.io`)
- **Offer**: Austin Local Restaurant Website Refresh Specialists. We turn outdated, clunky restaurant websites into modern, high-converting digital experiences.
- **Tone**: Sleek, premium, dynamic, and state-of-the-art ($25,000+ agency quality).

## Botanical Tech / Green Plant-Like Theme
- **Primary Color**: Emerald/Botanical Green (`#10B981` / `hsl(142, 71%, 45%)`)
- **Accent Color**: Sage/Mint (`#A7F3D0` / `hsl(150, 30%, 85%)`)
- **Dark Background**: Deep Forest/Obsidian (`#064E3B` to `#022C22` / `hsl(155, 45%, 8%)`)
- **Visual Style**:
  - **Glassmorphism**: Use backdrop filters (`bg-white/10 backdrop-blur-md border border-white/20`).
  - **Micro-Animations**: Smooth hover states, glowing borders, floating cards, and subtle organic leaf/botanical motifs.
  - **Typography**: Clean, modern sans-serif (e.g., *Outfit*, *Inter*, or *Plus Jakarta Sans*).

## MCP Server & UI Guidelines (`shadcn`)
- **Always use the connected `shadcn` MCP server** when adding new UI components (cards, bento grids, buttons, pricing tables, hero sections).
- Compose well-tested components rather than generating ad-hoc CSS from scratch.
- Use **Framer Motion** or **Tailwind CSS v4** (`@theme`) for transitions and scroll-triggered animations.
- Refer to `.claude/rules/design-system.md` and `.claude/rules/animation-spec.md` for complete specification constraints.

## Token & Context Optimization Rules
- Keep file reads specific (use line ranges when checking existing files).
- Run `/compact` between major feature milestones to keep the session context window clean and fast.
- Do not output lengthy boilerplate or redundant explanation text.
