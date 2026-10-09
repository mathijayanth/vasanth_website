import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { fieldStyles } from "./primitives";

type SelectProps = ComponentProps<"select"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Select({
  className,
  id,
  label,
  hint,
  error,
  children,
  "aria-invalid": ariaInvalid,
  ...props
}: SelectProps) {
  const selectId =
    id ?? (label ? `field-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const invalid = Boolean(error) || ariaInvalid;
  const describedBy =
    [
      hint && selectId ? `${selectId}-hint` : null,
      error && selectId ? `${selectId}-error` : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className={cn(
            fieldStyles,
            "appearance-none pr-10",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted"
        >
          ▾
        </span>
      </div>
      {hint && !error ? (
        <p id={`${selectId}-hint`} className="text-caption">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${selectId}-error`} className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
