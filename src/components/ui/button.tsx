import type { ComponentProps } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { disabledStyles, focusRing, touchTarget, transitionBase } from "./primitives";
import { Spinner } from "./spinner";

const baseStyles = cn(
  "inline-flex items-center justify-center gap-2 rounded-xl px-5 text-sm font-medium",
  touchTarget,
  transitionBase,
  focusRing,
  disabledStyles,
);

const variants = {
  primary: "bg-primary text-white shadow-soft hover:bg-primary/90",
  secondary:
    "border border-border bg-card text-foreground shadow-soft hover:border-primary/30 hover:bg-background",
  ghost: "text-foreground hover:bg-border/50",
  danger: "bg-error text-white shadow-soft hover:bg-error/90",
  link: "min-h-0 min-w-0 px-0 text-primary underline-offset-4 hover:underline",
} as const;

const sizes = {
  sm: "min-h-9 px-3 text-xs",
  md: "px-5 text-sm",
  lg: "min-h-12 px-6 text-base",
} as const;

type ButtonProps = ComponentProps<"button"> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  isLoading?: boolean;
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" />
          <span className="sr-only">Loading</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

export { variants as buttonVariants, sizes as buttonSizes };
