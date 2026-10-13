"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { focusRing } from "./primitives";

export type AccordionItem = { question: string; answer: string };

export function Accordion({ items, className }: { items: readonly AccordionItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <div className={cn("divide-y divide-border rounded-3xl border border-border bg-card shadow-card", className)}>
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className={cn(
                  "flex min-h-14 w-full items-center justify-between gap-6 px-6 py-5 text-left text-base font-semibold text-foreground transition-colors hover:text-primary sm:px-8",
                  focusRing,
                )}
              >
                {item.question}
                <span
                  aria-hidden
                  className={cn(
                    "relative flex size-8 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300",
                    open && "rotate-45 border-primary bg-primary text-white",
                  )}
                >
                  <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-body text-muted sm:px-8">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
