import * as React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Band } from "@/components/band";
import { Magnetic } from "@/components/motion/magnetic";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CtaBandProps {
  title: React.ReactNode;
  body: React.ReactNode;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
  className?: string;
}

/* Shared closing CTA. A rounded glass panel (with the border beam) floating
   on a full-bleed dark forest band — replaces the five duplicated CTA blocks
   across the home + services/process/reviews/work pages. Copy is passed in
   verbatim so nothing changes but the presentation. Render outside a page's
   max-width wrapper so the band goes edge to edge. */
export function CtaBand({
  title,
  body,
  primary,
  secondary,
  className,
}: CtaBandProps) {
  return (
    <Band className={cn("mt-24 py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-4xl px-6">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card/50 px-6 py-14 text-center shadow-glow-md backdrop-blur-xl sm:px-12">
          <BorderBeam size={90} duration={9} />
          <h2 className="font-display text-title text-balance text-foreground">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lede text-muted-foreground">
            {body}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Magnetic strength={6}>
              <Button
                asChild
                size="lg"
                className="group h-12 rounded-full px-6 text-sm shadow-glow-lg hover:shadow-glow-xl"
              >
                <Link href={primary.href}>
                  <Sparkles />
                  {primary.label}
                  <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </Magnetic>
            {secondary && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 rounded-full border-primary/30 bg-card/40 px-6 text-sm text-foreground/90 backdrop-blur-md hover:bg-primary/10 hover:text-foreground"
              >
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Band>
  );
}
