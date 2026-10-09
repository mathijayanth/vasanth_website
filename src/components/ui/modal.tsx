"use client";

import type { ComponentProps, ReactNode } from "react";
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";
import { focusRing, transitionBase } from "./primitives";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
  footer,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const onCancel = (event: Event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", onCancel);
    return () => dialog.removeEventListener("cancel", onCancel);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className={cn(
        "fixed inset-0 z-50 m-auto w-[min(100%,32rem)] max-h-[min(100dvh,90vh)] overflow-auto rounded-2xl border border-border bg-card p-0 shadow-elevated backdrop:bg-foreground/40",
        transitionBase,
        "opacity-0 open:opacity-100",
        className,
      )}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      <div className="flex flex-col gap-4 p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-title">
              {title}
            </h2>
            {description ? (
              <p id={descId} className="mt-1 text-caption">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={cn(
              "inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-muted hover:bg-border/50 hover:text-foreground",
              focusRing,
            )}
          >
            ×
          </button>
        </header>
        <div className="text-body">{children}</div>
        {footer ? <footer className="flex flex-wrap gap-3 pt-2">{footer}</footer> : null}
      </div>
    </dialog>
  );
}

type ModalTriggerProps = ComponentProps<"button">;

export function ModalCloseButton({ className, ...props }: ModalTriggerProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium shadow-soft hover:bg-background",
        focusRing,
        className,
      )}
      {...props}
    />
  );
}
