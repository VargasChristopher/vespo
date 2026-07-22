"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "none";

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { y: distance };
    case "down":
      return { y: -distance };
    case "left":
      return { x: distance };
    case "right":
      return { x: -distance };
    default:
      return {};
  }
}

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
  delay?: number;
  duration?: number;
  blur?: boolean;
  once?: boolean;
  margin?: string;
}

/* Standard scroll reveal (.claude/rules/animation-spec.md §2). Defaults
   reproduce the original behavior — y 30→0, opacity 0→1, 0.6s easeOut,
   once/-100px — so existing call sites are unchanged; new props add
   direction / blur / delay control. Static under prefers-reduced-motion. */
export function Reveal({
  children,
  className,
  direction = "up",
  distance = 30,
  delay = 0,
  duration = 0.6,
  blur = false,
  once = true,
  margin = "-100px",
}: RevealProps) {
  const reduce = !!useReducedMotion();
  const off = reduce ? {} : offsetFor(direction, distance);

  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? false
          : { opacity: 0, ...off, ...(blur ? { filter: "blur(6px)" } : {}) }
      }
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        ...(blur ? { filter: "blur(0px)" } : {}),
      }}
      viewport={{ once, margin }}
      transition={{ duration, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}

/* Stagger container for cascading child reveals — pair with <RevealItem>. */
export function RevealStagger({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  once = true,
  margin = "-100px",
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  once?: boolean;
  margin?: string;
}) {
  const reduce = !!useReducedMotion();
  const parent: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
    },
  };
  return (
    <motion.div
      className={className}
      variants={parent}
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once, margin }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = !!useReducedMotion();
  const variants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
