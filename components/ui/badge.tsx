import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "border-border bg-card text-foreground",
  primary: "border-primary/20 bg-primary/10 text-primary",
  secondary: "border-secondary/25 bg-secondary/10 text-secondary",
  success: "border-success/25 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  error: "border-error/25 bg-error/10 text-error",
} as const;

type BadgeProps = ComponentProps<"span"> & {
  variant?: keyof typeof variants;
};

export function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
