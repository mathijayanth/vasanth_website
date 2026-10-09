"use client";

import type { ComponentProps } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { focusRing, interactiveSurface, touchTarget, transitionBase } from "./primitives";

export type DropdownItem = {
  id: string;
  label: string;
  onSelect?: () => void;
  href?: string;
  disabled?: boolean;
};

type DropdownProps = {
  triggerLabel: string;
  items: DropdownItem[];
  align?: "start" | "end";
  className?: string;
};

export function Dropdown({
  triggerLabel,
  items,
  align = "end",
  className,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          interactiveSurface,
          touchTarget,
          "inline-flex items-center gap-2 px-4 text-sm font-medium text-foreground",
        )}
      >
        {triggerLabel}
        <span aria-hidden className="text-muted">
          ▾
        </span>
      </button>
      {open ? (
        <ul
          id={menuId}
          role="menu"
          className={cn(
            "absolute z-40 mt-2 min-w-[12rem] overflow-hidden rounded-xl border border-border bg-card py-1 shadow-elevated",
            align === "end" ? "right-0" : "left-0",
          )}
        >
          {items.map((item) => (
            <li key={item.id} role="none">
              <DropdownMenuItem
                item={item}
                onClose={() => setOpen(false)}
              />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function DropdownMenuItem({
  item,
  onClose,
}: {
  item: DropdownItem;
  onClose: () => void;
}) {
  const className = cn(
    "flex w-full items-center px-4 py-2.5 text-left text-sm text-foreground",
    transitionBase,
    focusRing,
    item.disabled
      ? "cursor-not-allowed opacity-50"
      : "hover:bg-background focus:bg-background",
  );

  if (item.href && !item.disabled) {
    return (
      <a role="menuitem" href={item.href} className={className} onClick={onClose}>
        {item.label}
      </a>
    );
  }

  return (
    <button
      type="button"
      role="menuitem"
      disabled={item.disabled}
      className={className}
      onClick={() => {
        item.onSelect?.();
        onClose();
      }}
    >
      {item.label}
    </button>
  );
}

type DropdownMenuProps = ComponentProps<"div">;

export function DropdownMenu({ className, children, ...props }: DropdownMenuProps) {
  return (
    <div
      role="menu"
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card py-1 shadow-elevated",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
