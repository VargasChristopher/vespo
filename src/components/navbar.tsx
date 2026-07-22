"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderOpen,
  LayoutGrid,
  Menu,
  Route,
  Send,
  Star,
  X,
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { scrollToTarget } from "@/lib/scroll";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/motion/magnetic";
import { ThemeToggle } from "@/components/theme-toggle";
import { SPRING } from "@/lib/motion";

/* Notch surface: theme-tinted glass (warm paper / forest obsidian instead of
   flat zinc/black), backdrop-blurred, and condensed on scroll. */
const SURFACE =
  "bg-background/80 backdrop-blur-xl transition-[background-color,box-shadow] duration-300 group-data-[scrolled=true]/nav:bg-background/92";

/* Clicking the link for the page you are already on is a no-op navigation in
   Next: it leaves you wherever you happened to be scrolled to. Send it to the
   top instead. Routes through the shared scroll helper, so it is smooth under
   Lenis and instant under prefers-reduced-motion. */
function sameRouteScrollToTop(e: React.MouseEvent, isCurrent: boolean) {
  if (!isCurrent) return;
  e.preventDefault();
  scrollToTarget(0, { offset: 0 });
}

const NavLink = ({
  href,
  icon: Icon,
  label,
  active,
  onNavigate,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) => (
  <Link
    href={href}
    aria-current={active ? "page" : undefined}
    onClick={(e) => {
      onNavigate?.();
      sameRouteScrollToTop(e, active);
    }}
    className={cn(
      "group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-sm font-medium transition-colors",
      active ? "text-foreground" : "text-foreground/70 hover:text-foreground"
    )}
  >
    {active && (
      <motion.span
        layoutId="nav-active"
        transition={SPRING}
        className="absolute inset-0 -z-10 rounded-full border border-primary/25 bg-primary/10"
      />
    )}
    <Icon className="size-4 shrink-0 text-primary opacity-80 transition-transform group-hover:scale-110 group-hover:opacity-100" />
    <span>{label}</span>
  </Link>
);

function ContactButton({
  className,
  active = false,
  onNavigate,
}: {
  className?: string;
  active?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Button
      asChild
      size="sm"
      className={cn(
        "group h-8 shrink-0 rounded-full px-3.5 text-xs font-semibold shadow-glow-lg transition-all hover:shadow-glow-xl",
        className
      )}
    >
      <Link
        href="/contact"
        aria-current={active ? "page" : undefined}
        onClick={(e) => {
          onNavigate?.();
          sameRouteScrollToTop(e, active);
        }}
      >
        <Send className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
        <span className="whitespace-nowrap">Contact</span>
      </Link>
    </Button>
  );
}

/* ------------------------------------------------------------------ */
/* Notch pieces. The header is a minmax(0,1fr)/auto/minmax(0,1fr) grid:
   the logo cell is pinned to exact screen center, each half's tall
   glass hugs its own content (no dead glass), and the thin flex-1 bars
   absorb whatever width is left over on their side. A woven sage double
   hairline (foreground + primary) traces every piece.                  */

function GlassLines() {
  return (
    <svg
      aria-hidden
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1="63.5"
        x2="100%"
        y2="63.5"
        stroke="currentColor"
        strokeOpacity={0.12}
        strokeWidth={0.5}
        className="text-foreground"
      />
      <line
        x1="0"
        y1="60.5"
        x2="100%"
        y2="60.5"
        stroke="currentColor"
        strokeOpacity={0.32}
        strokeWidth={0.5}
        className="text-primary"
      />
    </svg>
  );
}

function GlassSegment({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex h-16 shrink-0 items-center border-b border-border/40 dark:border-border/20",
        SURFACE,
        className
      )}
    >
      <GlassLines />
      {children}
    </div>
  );
}

function ThinBar({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative z-20 h-10 min-w-0 flex-1 border-b border-border/40 dark:border-border/20",
        SURFACE,
        className
      )}
    >
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full pointer-events-none"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="39.5"
          x2="100%"
          y2="39.5"
          stroke="currentColor"
          strokeOpacity={0.12}
          strokeWidth={0.5}
          className="text-foreground"
        />
        <line
          x1="0"
          y1="36.5"
          x2="100%"
          y2="36.5"
          stroke="currentColor"
          strokeOpacity={0.32}
          strokeWidth={0.5}
          className="text-primary"
        />
      </svg>
    </div>
  );
}

function CornerLeft() {
  return (
    <div className="relative -ml-px h-full w-[50px] shrink-0">
      <div
        className={cn("absolute inset-0", SURFACE)}
        style={{ clipPath: "path('M0 0 H50 V64 C25 64 25 40 0 40 Z')" }}
      />
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 50 64"
      >
        <path
          d="M0 39.5 C25 39.5 25 63.5 50 63.5"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.12}
          strokeWidth={0.5}
          className="text-foreground"
        />
        <path
          d="M0 36.5 C25 36.5 25 60.5 50 60.5"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.32}
          strokeWidth={0.5}
          className="text-primary"
        />
      </svg>
    </div>
  );
}

function CornerRight() {
  return (
    <div className="relative -ml-px h-full w-[50px] shrink-0">
      <div
        className={cn("absolute inset-0", SURFACE)}
        style={{ clipPath: "path('M0 0 H50 V40 C25 40 25 64 0 64 Z')" }}
      />
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 50 64"
      >
        <path
          d="M0 63.5 C25 63.5 25 39.5 50 39.5"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.12}
          strokeWidth={0.5}
          className="text-foreground"
        />
        <path
          d="M0 60.5 C25 60.5 25 36.5 50 36.5"
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.32}
          strokeWidth={0.5}
          className="text-primary"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */

const menuContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};
const menuItem: Variants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 },
};

export function Navbar({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Kovsk-style IA. /work (Projects) and /reviews are future build phases;
     the Contact CTA carries the quiz-first scope page at /contact. */
  const items = {
    left: [
      { label: "Services", href: "/services", icon: LayoutGrid },
      { label: "Process", href: "/process", icon: Route },
    ],
    right: [
      { label: "Projects", href: "/work", icon: FolderOpen },
      { label: "Reviews", href: "/reviews", icon: Star },
    ],
  };

  return (
    <>
      <header
        data-scrolled={scrolled}
        className={cn(
          "group/nav fixed top-0 inset-x-0 z-50 flex h-16 select-none",
          className
        )}
        {...props}
      >
        {/* Equal flex-1 bars center the notch block; content flows compactly
            inside it, so the notch hugs its items with no dead glass. */}
        <ThinBar />
        <CornerLeft />
        <GlassSegment className="-ml-px min-w-0 gap-2 px-3 sm:px-4 xl:gap-5">
          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-1.5 text-foreground/75 hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5 relative z-20 shrink-0"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>

          {/* Desktop Left Nav */}
          <nav className="hidden lg:flex gap-1.5 xl:gap-3 items-center shrink-0">
            {items.left.map((item) => (
              <NavLink
                key={item.label}
                {...item}
                active={pathname === item.href}
              />
            ))}
          </nav>

          {/* Logo */}
          <Link
            href="/"
            aria-label="Vespo home"
            onClick={(e) => {
              setIsMobileMenuOpen(false);
              sameRouteScrollToTop(e, pathname === "/");
            }}
            className="group relative z-30 mx-1 flex shrink-0 items-center gap-2.5 transition-transform duration-300 hover:scale-102 group-data-[scrolled=true]/nav:scale-95 sm:mx-2"
          >
            <Image
              src="/assets/vespo_emblem.png"
              alt=""
              width={26}
              height={26}
              preload
              className="dark:brightness-0 dark:invert transition-transform duration-300 group-hover:rotate-12 shrink-0"
            />
            <Image
              src="/assets/vespo_wordmark.png"
              alt="Vespo"
              width={90}
              height={28}
              preload
              className="dark:brightness-0 dark:invert transition-opacity duration-300 group-hover:opacity-90 translate-y-[2.5px] shrink-0"
            />
          </Link>

          {/* Desktop Right Nav */}
          <nav className="hidden lg:flex gap-1.5 xl:gap-3 items-center shrink-0">
            {items.right.map((item) => (
              <NavLink
                key={item.label}
                {...item}
                active={pathname === item.href}
              />
            ))}
          </nav>

          {/* Divider, Contact, then the theme toggle at the far end */}
          <div className="relative z-30 flex shrink-0 items-center gap-2.5 sm:gap-3 lg:border-l lg:border-primary/15 lg:pl-3 xl:pl-4">
            <Magnetic strength={6} className="hidden sm:inline-flex">
              <ContactButton active={pathname === "/contact"} />
            </Magnetic>
            <ThemeToggle className="shrink-0" />
          </div>
        </GlassSegment>
        <CornerRight />
        <ThinBar className="-ml-px" />
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur-2xl lg:hidden"
          >
            <motion.nav
              variants={menuContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-2"
            >
              {[...items.left, ...items.right].map((item) => (
                <motion.div key={item.label} variants={menuItem}>
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="flex items-center gap-3.5 rounded-xl p-3 transition-colors hover:bg-foreground/5"
                    onClick={(e) => {
                      setIsMobileMenuOpen(false);
                      sameRouteScrollToTop(e, pathname === item.href);
                    }}
                  >
                    <item.icon className="size-5 text-primary-strong" />
                    <span className="font-semibold text-foreground/90">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={menuItem} className="h-px bg-foreground/10 my-3" />
              <motion.div variants={menuItem} className="px-1">
                <ContactButton
                  className="w-full h-10 text-sm justify-center inline-flex"
                  active={pathname === "/contact"}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
