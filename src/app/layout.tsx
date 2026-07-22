import type { Metadata } from "next";
import { Sora, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { BotanicalBackground } from "@/components/botanical-background";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ThemeProvider } from "@/components/theme-provider";

/* Brand type: Sora (variable geometric sans) for display headlines,
   Instrument Sans (variable body/UI, wght 400-700), JetBrains Mono
   (kickers, stats, labels). */
const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vespo.io"),
  title: {
    default: "Vespo | Digital Marketing for Food Trucks · Born in Austin, TX",
    template: "%s | Vespo",
  },
  description:
    "Founded in Austin, serving food trucks nationwide. We rebuild food truck websites to today's standards and add an AI assistant you run by text: send today's address and the site updates, ask for a post and it writes one, and it answers catering leads in minutes. Live in 14 days. 100% risk-free preview.",
  keywords: [
    "food truck website design",
    "food truck website refresh",
    "AI marketing for food trucks",
    "food truck social media automation",
    "food truck catering website design",
    "mobile food truck menu builder",
    "food truck marketing agency",
    "food truck online ordering system",
    "Vespo",
  ],
  authors: [{ name: "Vespo", url: "https://vespo.io" }],
  creator: "Vespo",
  publisher: "Vespo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/assets/vespo_emblem.png",
    shortcut: "/assets/vespo_emblem.png",
    apple: "/assets/vespo_emblem.png",
  },
  openGraph: {
    title: "Vespo | Digital Marketing for Food Trucks · Born in Austin, TX",
    description:
      "A modern site that loads in 0.3 seconds, plus an AI assistant you text to update it. Catering leads answered in minutes. Born in Austin, live in 14 days.",
    url: "https://vespo.io",
    siteName: "Vespo",
    locale: "en_US",
    type: "website",
    images: [
      {
        // Composed 1200x630 card; the raw logo PNGs are small (<=156px) and
        // would render blurry/unbranded in iMessage/LinkedIn previews.
        url: "/assets/vespo_og.png",
        width: 1200,
        height: 630,
        alt: "Vespo: Food Truck Websites & AI Marketing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vespo | Digital Marketing for Food Trucks · Born in Austin, TX",
    description:
      "Hungry people are searching right now. A modern site plus an AI assistant you run by text makes sure they find your truck first. Live in 14 days.",
    images: ["/assets/vespo_og.png"],
    creator: "@vespotx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/* LocalBusiness structured data (ProfessionalService is the LocalBusiness
   subtype for agencies). Only verifiable facts: no fabricated phone,
   street address, hours, or ratings, which risk manual-action penalties. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://vespo.io/#business",
  name: "Vespo",
  alternateName: "Vespo",
  url: "https://vespo.io",
  logo: "https://vespo.io/assets/vespo_emblem.png",
  image: "https://vespo.io/assets/vespo_og.png",
  description:
    "Founded in Austin, serving food trucks nationwide. We rebuild food truck websites to today's standards and add an AI assistant you run by text: send today's address and the site updates, ask for a post and it writes one, and it answers catering leads in minutes. Live in 14 days. 100% risk-free preview.",
  slogan: "Your food is unforgettable. Your truck should be unmissable.",
  address: {
    "@type": "PostalAddress",
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: [
    { "@type": "Country", name: "United States" },
  ],
  sameAs: ["https://twitter.com/vespotx"],
  knowsAbout: [
    "food truck website design",
    "food truck catering websites",
    "AI marketing for food trucks",
    "social media automation",
    "mobile menu design",
    "zero commission online ordering",
  ],
  makesOffer: {
    "@type": "Offer",
    name: "Food Truck Website Refresh",
    description:
      "14-day website refresh: live truck location map, 1-tap mobile menu with order-ahead, an AI assistant texted from the owner's phone to update location and post to Instagram and Facebook, and instant catering follow-up. Interactive preview before any payment.",
    areaServed: { "@type": "Country", name: "United States" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${instrumentSans.variable} ${jetbrainsMono.variable} light h-full scroll-pt-24 antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
          <SmoothScroll />
          <a
            href="#main"
            className="sr-only z-[60] rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <BotanicalBackground className="fixed inset-0 -z-10" />
          <Navbar />
          {children}
          <Footer />
          <ScrollToTop />
        </ThemeProvider>
      </body>
    </html>
  );
}
