import * as React from "react";

import { cn } from "@/lib/utils";

export interface BandProps extends React.HTMLAttributes<HTMLElement> {
  as?: "section" | "footer" | "div";
}

/* Full-bleed dark forest "band". Carries data-band="dark" AND class="dark":
   globals.css remaps the shadcn tokens to a lifted forest material, and the
   dark class makes dark: variant utilities fire for descendants under both
   page themes (e.g. logo dark:invert). Opaque by design — the fixed
   BotanicalBackground must not show through. */
export function Band({ children, className, as = "section", ...props }: BandProps) {
  const Tag = as;
  return (
    <Tag
      data-band="dark"
      className={cn(
        "dark relative isolate overflow-hidden bg-background text-foreground",
        className
      )}
      {...props}
    >
      {/* hairline top/bottom edges */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-primary-strong/20"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-primary-strong/20"
      />
      {/* soft sage bloom from the top edge */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 80% at 50% 0%, rgb(var(--glow) / 0.14), transparent 70%)",
        }}
      />
      {children}
    </Tag>
  );
}
