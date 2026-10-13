"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const staggerDelays = [
  "",
  "delay-75",
  "delay-150",
  "delay-200",
  "delay-300",
  "delay-[400ms]",
  "delay-500",
  "delay-[600ms]",
  "delay-700",
] as const;

type RevealProps = {
  children: ReactNode;
  as?: "div" | "li" | "section" | "article" | "span";
  /** Position in a staggered group; each step adds a short delay. */
  index?: number;
  variant?: "up" | "scale" | "left";
  className?: string;
};

/** Fades and slides its content in the first time it scrolls into view. */
export function Reveal({ children, as: Tag = "div", index = 0, variant = "up", className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const show = () => node.setAttribute("data-visible", "true");
    if (typeof IntersectionObserver === "undefined") {
      show();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      data-reveal={variant}
      className={cn(staggerDelays[Math.min(index, staggerDelays.length - 1)], className)}
    >
      {children}
    </Tag>
  );
}
