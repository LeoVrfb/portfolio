"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
}

export function Reveal({
  children,
  delay = 0,
  y = 14,
  duration = 0.5,
  className,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px -80px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: "blur(4px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
