/**
 * Design tokens (mirror of CSS variables in app/globals.css).
 * Use Tailwind utilities in components; import these for JS-driven UI or docs.
 */
export const colors = {
  background: "#F8F5EF",
  primary: "#51105F",
  secondary: "#7D368C",
  accent: "#D0BDA1",
  text: "#3A1844",
  muted: "#6F5D68",
  border: "#E6DDD0",
  card: "#FFFFFF",
  success: "#16A34A",
  warning: "#F59E0B",
  error: "#DC2626",
} as const;

export const typography = {
  fontSans: "var(--font-sans)",
  fontSerif: "var(--font-serif)",
  sizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  lineHeights: {
    tight: "1.25",
    snug: "1.375",
    normal: "1.5",
    relaxed: "1.625",
  },
} as const;

/** 4px base scale */
export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  8: "2rem",
  10: "2.5rem",
  12: "3rem",
  16: "4rem",
  touch: "2.75rem",
} as const;

export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  full: "9999px",
} as const;

export const shadows = {
  soft: "var(--shadow-soft)",
  card: "var(--shadow-card)",
  elevated: "var(--shadow-elevated)",
} as const;

/** Align with Tailwind default breakpoints */
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

export const transitions = {
  fast: "150ms",
  base: "200ms",
  slow: "300ms",
  easing: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;
