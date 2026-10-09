import { cn } from "@/lib/utils";

/** Visible focus ring — use on interactive controls */
export const focusRing = cn(
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
);

export const transitionBase = "transition-[color,background-color,border-color,box-shadow,opacity] duration-200 ease-out";

export const disabledStyles = "disabled:pointer-events-none disabled:opacity-50";

/** Shared shell for Input, Textarea, Select */
export const fieldStyles = cn(
  "w-full min-h-11 rounded-xl border border-border bg-card px-4 text-sm text-foreground shadow-soft",
  "placeholder:text-muted",
  transitionBase,
  disabledStyles,
  focusRing,
  "aria-invalid:border-error aria-invalid:ring-2 aria-invalid:ring-error/15",
);

export const interactiveSurface = cn(
  "rounded-xl border border-border bg-card shadow-soft",
  transitionBase,
  focusRing,
);

/** Minimum touch target (44px) */
export const touchTarget = "min-h-11 min-w-11";
