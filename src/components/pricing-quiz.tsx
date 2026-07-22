"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChefHat,
  HelpCircle,
  Layers,
  LayoutGrid,
  RotateCcw,
  Send,
  ShieldCheck,
  Smartphone,
  Store,
  Truck,
  Utensils,
  Wallet,
} from "lucide-react";

import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SPRING_SLIDE } from "@/lib/motion";
import { scrollToTarget } from "@/lib/scroll";
import { cn } from "@/lib/utils";

/*
 * Kovsk-style booking quiz (kovsk.com/contact): "Question X of 3", one
 * single-select question per screen, then contact capture. No prices on
 * the page: the free audit call is booked here, and the number is agreed
 * together on that 30-minute call.
 *
 * Animation spec (.claude/rules/animation-spec.md):
 * 1. Step transitions: AnimatePresence mode="wait", direction-aware
 *    slide x ±48 with fade, enter 0.35s easeOut / exit 0.2s easeIn.
 * 2. Progress bar: width animates to (step+1)/4, 0.4s easeOut.
 * Both gate on useReducedMotion() → instant static renders.
 */

type IconType = React.ComponentType<{ className?: string }>;

type QuestionId = "projectType" | "fleetSize" | "budget";

interface QuoteFormData {
  projectType: string | null;
  fleetSize: string | null;
  budget: string | null;
  timeline: string | null;
  truckName: string;
  ownerName: string;
  email: string;
  notes: string;
}

interface QuizOption {
  id: string;
  icon: IconType;
  label: string;
  blurb: string;
}

interface QuizQuestion {
  id: QuestionId;
  title: string;
  sub: string;
  columns: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    id: "projectType",
    title: "What are we building for your truck?",
    sub: "We scope the details together on the call.",
    columns: "sm:grid-cols-2",
    options: [
      {
        id: "site-ordering",
        icon: Utensils,
        label: "Site + zero-commission ordering",
        blurb: "Live park map, QR express menu, AI assistant you text",
      },
      {
        id: "app-push",
        icon: Smartphone,
        label: "Branded app + push alerts",
        blurb: "Geofenced “we just parked” pings",
      },
      {
        id: "catering",
        icon: ChefHat,
        label: "Catering growth engine",
        blurb: "AI follow-up that chases $5,000+ corporate gigs",
      },
      {
        id: "park",
        icon: Store,
        label: "Food park / multi-truck system",
        blurb: "Multi-vendor checkout, KDS routing",
      },
      {
        id: "full",
        icon: LayoutGrid,
        label: "The full package",
        blurb: "Site, ordering, and your AI assistant, phased so it pays as it goes",
      },
      {
        id: "unsure",
        icon: HelpCircle,
        label: "Not sure yet",
        blurb: "The call will tell us",
      },
    ],
  },
  {
    id: "fleetSize",
    title: "How many trucks are we scoping?",
    sub: "Fleet size changes the build more than anything else.",
    columns: "sm:grid-cols-3",
    options: [
      {
        id: "solo",
        icon: Truck,
        label: "1 truck",
        blurb: "One window, one menu, one map pin",
      },
      {
        id: "fleet",
        icon: Layers,
        label: "2 to 3 trucks or trailers",
        blurb: "Shared brand, separate schedules",
      },
      {
        id: "park",
        icon: Store,
        label: "4+ or a food truck park",
        blurb: "Multi-vendor, multi-location",
      },
    ],
  },
  {
    id: "budget",
    title: "Where should the investment land?",
    sub: "No wrong answer. This just shapes what we propose. The final number is agreed together on the call, not posted on a page.",
    columns: "sm:grid-cols-2",
    options: [
      {
        id: "lean",
        icon: Wallet,
        label: "Keep it lean",
        blurb: "Core features first, add the rest later",
      },
      {
        id: "standard",
        icon: Wallet,
        label: "The Industry standard",
        blurb: "What most single trucks invest",
      },
      {
        id: "growth",
        icon: Wallet,
        label: "Built to scale",
        blurb: "Fleet builds and app-heavy scopes",
      },
      {
        id: "open",
        icon: HelpCircle,
        label: "Tell me what it takes",
        blurb: "Show me the honest number for my scope",
      },
    ],
  },
];

const TIMELINES = ["Before the next rush", "1 to 3 months", "Just exploring"];

/* The site is a static export, so there is no /api route to POST to. This is
   the Cloudflare Worker in worker/, which emails the submission to the owner.
   Override per-environment with NEXT_PUBLIC_QUOTE_ENDPOINT (inlined at build
   time — see .github/workflows/deploy.yml). */
const QUOTE_ENDPOINT =
  process.env.NEXT_PUBLIC_QUOTE_ENDPOINT ?? "https://api.vespo.io/quote";

function initialData(): QuoteFormData {
  return {
    projectType: null,
    fleetSize: null,
    budget: null,
    timeline: null,
    truckName: "",
    ownerName: "",
    email: "",
    notes: "",
  };
}

function optionLabel(questionId: QuestionId, optionId: string | null) {
  if (!optionId) return null;
  const question = QUESTIONS.find((q) => q.id === questionId);
  return question?.options.find((o) => o.id === optionId)?.label ?? null;
}

function Field({
  label,
  htmlFor,
  required,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={htmlFor} className="text-foreground/90">
        {label}
        {required && (
          <span aria-hidden className="-ml-1 text-primary">
            *
          </span>
        )}
        {optional && (
          <span className="text-xs font-normal text-muted-foreground">(optional)</span>
        )}
      </Label>
      {children}
    </div>
  );
}

const inputStyle = "h-11 rounded-xl bg-background/40";

/* ---------------------------------------------------------------------- */

export function PricingQuiz() {
  const reduceMotion = !!useReducedMotion();
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [step, setStep] = React.useState(0); // 0-2 questions, 3 contact, 4 done
  const [direction, setDirection] = React.useState(1);
  const [data, setData] = React.useState<QuoteFormData>(initialData);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);
  /* Honeypot. Hidden from people and from screen readers; bots fill every
     field they find, so anything here means "discard". */
  const [company, setCompany] = React.useState("");

  const update = <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const emailOk = /^\S+@\S+\.\S+$/.test(data.email.trim());
  const stepValid =
    step < 3
      ? data[QUESTIONS[step].id] !== null
      : step === 3
        ? data.truckName.trim().length > 0 && data.ownerName.trim().length > 0 && emailOk
        : true;

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const reset = () => {
    setData(initialData());
    setDirection(-1);
    setStep(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stepValid || submitting) return;
    setDirection(1);
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(QUOTE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          /* Send the human-readable labels, not the option ids — this lands
             in an inbox, not a database. */
          projectType: optionLabel("projectType", data.projectType),
          fleetSize: optionLabel("fleetSize", data.fleetSize),
          budget: optionLabel("budget", data.budget),
          timeline: data.timeline,
          truckName: data.truckName,
          ownerName: data.ownerName,
          email: data.email,
          notes: data.notes,
          company,
        }),
      });
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      setStep(4);
    } catch {
      setSubmitError(
        "That didn't send. Try again, or email chrispy.en1@gmail.com directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Keep the card in view when steps change on scrolled/small viewports.
  React.useEffect(() => {
    if (step === 0) return;
    const top = cardRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 && cardRef.current) {
      scrollToTarget(cardRef.current);
    }
  }, [step]);

  const slideVariants: Variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduceMotion ? 0 : dir * 48 }),
    center: {
      opacity: 1,
      x: 0,
      transition: reduceMotion ? { duration: 0 } : SPRING_SLIDE,
    },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir * -48,
      transition: { duration: 0.2, ease: "easeIn" },
    }),
  };

  const question = step < 3 ? QUESTIONS[step] : null;
  const summaryChips = [
    optionLabel("projectType", data.projectType),
    optionLabel("fleetSize", data.fleetSize),
    optionLabel("budget", data.budget),
    data.timeline,
  ].filter(Boolean) as string[];

  return (
    <section id="quote" aria-label="Get your free marketing audit" className="scroll-mt-24">
      <Reveal>
        <div className="mx-auto mb-10 grid max-w-2xl gap-3 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            Book your free audit · 3 quick questions
          </p>
          <h1 className="font-display text-title text-balance text-foreground">
            Get your free marketing audit and demo.
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground">
            Three questions scope your call. On the call you get a straight audit of
            your site and socials, a live demo of your new site, and a number we
            agree on together.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div
          ref={cardRef}
          className="mx-auto max-w-3xl scroll-mt-24 overflow-hidden rounded-3xl border border-border/60 bg-card/40 p-6 shadow-glow backdrop-blur-xl sm:p-10"
        >
          {/* Kovsk-style progress: question counter + thin fill bar */}
          <div className="mb-8 flex items-center gap-4">
            <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {step < 3 ? `Question ${step + 1} of 3` : step === 3 ? "Last step" : "Request received"}
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-primary/15">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={false}
                animate={{ width: `${Math.min(((step + 1) / 4) * 100, 100)}%` }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Screen-reader step announcement */}
          <p aria-live="polite" className="sr-only">
            {question
              ? `Question ${step + 1} of 3: ${question.title}`
              : step === 3
                ? "Last step: where do we send your call times?"
                : "Request received."}
          </p>

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {step < 4 ? (
              <motion.form
                key={step}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="mb-7 grid gap-1.5">
                  <h3 className="font-display text-title-sm text-balance text-foreground">
                    {question ? question.title : "Where do we send your call times?"}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {question
                      ? question.sub
                      : "We reply within 24 hours, usually same day, with times for your free audit call."}
                  </p>
                </div>

                {question ? (
                  <div
                    role="radiogroup"
                    aria-label={question.title}
                    className={cn("grid gap-2.5", question.columns)}
                  >
                    {question.options.map((option) => {
                      const checked = data[question.id] === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          role="radio"
                          aria-checked={checked}
                          onClick={() => update(question.id, option.id)}
                          className={cn(
                            "flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring/50",
                            checked
                              ? "border-primary/60 bg-primary/10 shadow-glow-md"
                              : "border-border/70 bg-card/40 hover:border-primary/35 hover:bg-card/60"
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-xl border transition-colors",
                              checked
                                ? "border-primary/40 bg-primary/15"
                                : "border-border/60 bg-background/30"
                            )}
                          >
                            <option.icon
                              className={cn(
                                "size-4",
                                checked ? "text-primary" : "text-muted-foreground"
                              )}
                            />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-medium leading-6 text-foreground/90">
                              {option.label}
                            </span>
                            <span className="block text-xs leading-5 text-muted-foreground">
                              {option.blurb}
                            </span>
                          </span>
                          <span
                            aria-hidden
                            className={cn(
                              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                              checked
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border"
                            )}
                          >
                            {checked && <Check className="size-3.5" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid gap-5">
                    {/* Honeypot: off-screen, unlabelled, hidden from AT and
                        excluded from tab order. Only bots fill it in, and the
                        Worker silently discards anything that does. */}
                    <input
                      type="text"
                      name="company"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="pointer-events-none absolute -left-[9999px] size-0 opacity-0"
                    />
                    <Field label="Truck name" htmlFor="quote-truck" required>
                      <Input
                        id="quote-truck"
                        className={inputStyle}
                        value={data.truckName}
                        onChange={(e) => update("truckName", e.target.value)}
                        placeholder="Your truck name"
                        autoComplete="organization"
                      />
                    </Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Your name" htmlFor="quote-name" required>
                        <Input
                          id="quote-name"
                          className={inputStyle}
                          value={data.ownerName}
                          onChange={(e) => update("ownerName", e.target.value)}
                          placeholder="Maria Torres"
                          autoComplete="name"
                        />
                      </Field>
                      <Field label="Email" htmlFor="quote-email" required>
                        <Input
                          id="quote-email"
                          type="email"
                          className={inputStyle}
                          value={data.email}
                          onChange={(e) => update("email", e.target.value)}
                          placeholder="maria@yallfiredup.com"
                          autoComplete="email"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-2.5">
                      <Label className="text-foreground/90">
                        When do you want to be live?
                        <span className="text-xs font-normal text-muted-foreground">
                          (optional)
                        </span>
                      </Label>
                      <div
                        role="group"
                        aria-label="Launch timeline"
                        className="flex flex-wrap gap-2.5"
                      >
                        {TIMELINES.map((timeline) => {
                          const active = data.timeline === timeline;
                          return (
                            <button
                              key={timeline}
                              type="button"
                              aria-pressed={active}
                              onClick={() =>
                                update("timeline", active ? null : timeline)
                              }
                              className={cn(
                                "h-10 rounded-full border px-5 text-sm font-medium outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                                active
                                  ? "border-primary/60 bg-primary/15 text-foreground shadow-glow-md"
                                  : "border-border/70 bg-card/40 text-muted-foreground hover:border-primary/35 hover:text-foreground"
                              )}
                            >
                              {timeline}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <Field label="Anything we should know?" htmlFor="quote-notes" optional>
                      <Textarea
                        id="quote-notes"
                        className="min-h-24 rounded-xl bg-background/40"
                        value={data.notes}
                        onChange={(e) => update("notes", e.target.value)}
                        placeholder="POS setup, catering goals, park contract dates…"
                      />
                    </Field>
                  </div>
                )}

                <div className="mt-9 flex items-center justify-between gap-4 border-t border-border/50 pt-6">
                  {step > 0 ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={goBack}
                      className="rounded-full text-muted-foreground hover:text-foreground"
                    >
                      <ArrowLeft />
                      Back
                    </Button>
                  ) : (
                    <span aria-hidden />
                  )}
                  <Button
                    type="submit"
                    disabled={!stepValid || submitting}
                    className="group h-11 rounded-full px-6 text-sm shadow-glow-lg hover:shadow-glow-xl"
                  >
                    {step === 3 ? (
                      <>
                        {submitting ? "Sending…" : "Book My Audit Call"}
                        <Send />
                      </>
                    ) : (
                      <>
                        Next
                        <ArrowRight className="transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </Button>
                </div>
                {!stepValid && step === 3 && (
                  <p className="mt-3 text-right text-xs text-muted-foreground">
                    Truck name, your name, and a real email get your call booked.
                  </p>
                )}
                {submitError && (
                  <p
                    role="alert"
                    className="mt-3 text-right text-xs text-destructive"
                  >
                    {submitError}
                  </p>
                )}
              </motion.form>
            ) : (
              <motion.div
                key="done"
                custom={1}
                variants={slideVariants}
                initial="enter"
                animate="center"
                className="grid gap-8"
              >
                <div className="grid justify-items-center gap-3 text-center">
                  <span className="flex size-12 items-center justify-center rounded-full border border-primary/40 bg-primary/15">
                    <Check className="size-5 text-primary" />
                  </span>
                  <h3 className="font-display text-title-sm text-balance text-foreground">
                    You’re on the books. Talk soon.
                  </h3>
                  {summaryChips.length > 0 && (
                    <ul className="flex flex-wrap items-center justify-center gap-2">
                      {summaryChips.map((chip) => (
                        <li
                          key={chip}
                          className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-foreground/80"
                        >
                          {chip}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <ol className="grid gap-2.5">
                  {[
                    "Inside 24 hours: we email you times for your free marketing audit call.",
                    "On the call: your audit, plus a live demo of your new site.",
                    "Love it? We agree on one fair number together. You see the $0 preview before any invoice.",
                  ].map((text, i) => (
                    <li
                      key={text}
                      className="flex items-start gap-3.5 rounded-2xl border border-border/60 bg-background/30 p-4"
                    >
                      <span className="mt-0.5 font-mono text-[11px] text-primary">
                        0{i + 1}
                      </span>
                      <p className="text-sm leading-6 text-foreground/85">{text}</p>
                    </li>
                  ))}
                </ol>

                <div className="grid justify-items-center gap-4">
                  <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-primary" />
                      $0 preview before any invoice
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5 text-primary" />
                      Reply within 24 hours
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Truck className="size-3.5 text-primary" />
                      Live in 14 days
                    </li>
                  </ul>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={reset}
                    className="rounded-full text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw />
                    Start over
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Reveal>

      <div className="mt-10 grid justify-items-center gap-2.5 text-center">
        <p className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground">
          <ShieldCheck className="size-4 shrink-0 text-primary" />
          Every build starts behind the $0 gate: you see your working site before you pay a
          dollar.
        </p>
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground/70">
          Half up front, half after your site is live and taking orders
        </p>
      </div>
    </section>
  );
}
