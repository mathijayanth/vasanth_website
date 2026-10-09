import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { fieldStyles } from "./primitives";

type TextareaProps = ComponentProps<"textarea"> & {
  label?: string;
  hint?: string;
  error?: string;
};

export function Textarea({
  className,
  id,
  label,
  hint,
  error,
  rows = 4,
  "aria-invalid": ariaInvalid,
  ...props
}: TextareaProps) {
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
      <textarea
        id={inputId}
        rows={rows}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={cn(fieldStyles, "min-h-[7rem] py-3 leading-relaxed", className)}
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
