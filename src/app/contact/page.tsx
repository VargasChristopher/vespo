import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

import { PricingQuiz } from "@/components/pricing-quiz";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Get Your Free Marketing Audit & Demo",
  description:
    "Book a free 30-minute call: a straight audit of your site and socials, a live demo of your working preview, and one fair number agreed together. $0 preview before any invoice.",
};

const FAQS = [
  {
    q: "Why isn't there a price list?",
    a: "Because a solo trailer and a 3-truck fleet aren't the same build. Answer the three questions, book your free audit, and on the call we hand you two or three priced options after you've already watched your new site run. You never buy blind.",
  },
  {
    q: "How does payment actually work?",
    a: "Half up front to start the build and hold your slot, half after your site is live and taking orders. Before either one you get the free audit and see your new site on a call, so nothing is due until you've seen what you're buying. After launch it's $50/month to keep the site and AI running, and you can cancel that whenever.",
  },
  {
    q: "Do we really pay $0 in commissions?",
    a: "Yes. Orders run through your own Stripe or Square account, so you pay only the standard ~2.6% card-processing fee. No 15 to 30% cut, no middleman: 100% of food revenue lands in your bank.",
  },
  {
    q: "How long does it take to build and launch?",
    a: "14 days from the day your deposit lands, timed so launch falls right before a weekend rush. You cook the whole time; we handle every piece of the tech.",
  },
  {
    q: "Can we change our daily menu and parked location?",
    a: "Yes, that's the point. Pin today's exact truck spot and toggle sold-out items from your phone in about 2 seconds. The site, live map, and QR menu update instantly.",
  },
  {
    q: "Will this work with our existing Square / Clover / Toast POS?",
    a: "Yes. Orders fire straight to the kitchen receipt printer or KDS you already run. No new tablet, no double entry, no retraining the crew.",
  },
  {
    q: "Who writes the social posts?",
    a: "You text your AI assistant what's going on and it writes the post. Send \"brisket is back, parked at 6th til 9\" and it comes back as a finished caption you approve from your phone. Same for repeat DMs and Google review replies: drafted for you, approved by you.",
  },
];

/* FAQPage structured data: same escaping convention as the LocalBusiness
   script in layout.tsx (bundled docs: json-ld.md). */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: { "@type": "Answer", text: faq.a },
  })),
};

export default function ContactPage() {
  return (
    <main id="main" className="relative z-10 flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-28 sm:pt-32">
        <PricingQuiz />

        <section aria-labelledby="faq-heading" className="mx-auto mt-24 max-w-3xl">
          <div className="mb-8 grid gap-3 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              Your questions. Answered.
            </p>
            <h2
              id="faq-heading"
              className="font-display text-title-sm text-balance text-foreground"
            >
              Straight answers before the call.
            </h2>
          </div>
          <Accordion
            type="single"
            collapsible
            className="rounded-3xl border border-border/60 bg-card/40 px-6 shadow-glow backdrop-blur-xl sm:px-8"
          >
            {FAQS.map((faq, i) => (
              <AccordionItem key={faq.q} value={`faq-${i}`} className="border-border/50">
                <AccordionTrigger className="py-5 text-base text-foreground hover:text-primary-strong">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-6 text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 grid justify-items-center gap-4 text-center">
            <p className="text-base leading-7 text-muted-foreground">
              Ready when you are. Three questions, one call, and you see your
              truck&apos;s new site free.
            </p>
            <Button
              asChild
              size="lg"
              className="group h-11 rounded-full px-6 text-sm shadow-glow-lg hover:shadow-glow-xl"
            >
              <Link href="#quote">
                Start the 3 Questions
                <ArrowUp className="transition-transform group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </section>
      </section>
    </main>
  );
}
