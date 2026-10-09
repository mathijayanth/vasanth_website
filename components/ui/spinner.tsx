import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type SpinnerProps = ComponentProps<"span"> & {
  size?: "sm" | "md" | "lg";
};

const sizes = {
  sm: "size-4 border-2",
  md: "size-5 border-2",
  lg: "size-8 border-[3px]",
} as const;

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-live="polite"
      className={cn("inline-block", className)}
      {...props}
    >
      <span
        className={cn(
          "inline-block animate-spin rounded-full border-border border-t-primary",
          sizes[size],
        )}
        aria-hidden
      />
      <span className="sr-only">Loading</span>
    </span>
  );
}
