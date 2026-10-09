import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { fieldStyles } from "./primitives";

type InputProps = ComponentProps<"input"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Input({
  className,
  id,
  label,
  hint,
  error,
  "aria-invalid": ariaInvalid,
  ...props
}: InputProps) {
  const inputId =
    id ?? (label ? `field-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  const invalid = Boolean(error) || ariaInvalid;
  const describedBy =
    [
      hint && inputId ? `${inputId}-hint` : null,
      error && inputId ? `${inputId}-error` : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className="w-full space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(fieldStyles, className)}
        {...props}
      />
      {hint && !error ? (
        <p id={`${inputId}-hint`} className="text-caption">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${inputId}-error`} className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
