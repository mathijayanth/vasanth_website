"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { focusRing, touchTarget } from "@/components/ui/primitives";
import { primaryNavLinks } from "@/config/site";
import { cn } from "@/lib/utils";

function SearchIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center rounded-xl border border-border bg-card lg:hidden",
            touchTarget,
            focusRing,
          )}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden className="text-xl leading-none">
            {menuOpen ? "×" : "☰"}
          </span>
        </button>

        <Link
          href="/"
          className="font-serif text-lg font-semibold tracking-tight text-foreground"
        >
          Vital<span className="text-secondary">Notes</span>
        </Link>

        <nav
          aria-label="Primary"
          className="ml-2 hidden flex-1 items-center gap-6 md:flex"
        >
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-medium text-foreground shadow-soft hover:border-primary/30",
              touchTarget,
              focusRing,
            )}
          >
            <SearchIcon />
            <span className="hidden sm:inline">Search</span>
          </Link>
          <Link
            href="/login"
            className={cn(
              "inline-flex items-center rounded-xl bg-primary px-4 text-sm font-medium text-white shadow-soft hover:bg-primary/90",
              touchTarget,
              focusRing,
            )}
          >
            Login
          </Link>
        </div>
      </div>

      <div
        id={menuId}
        className={cn(
          "fixed inset-0 z-40 lg:hidden",
          menuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Close menu overlay"
          className={cn(
            "absolute inset-0 bg-foreground/40 transition-opacity duration-200",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-border bg-card shadow-elevated transition-transform duration-200",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <span className="text-sm font-semibold">Menu</span>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className={cn(touchTarget, focusRing, "rounded-xl px-3 text-muted")}
            >
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
            {primaryNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  "rounded-xl px-4 py-3 text-base font-medium text-foreground hover:bg-background",
                  focusRing,
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/search"
              onClick={() => setMenuOpen(false)}
              className={cn(
                "mt-2 inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 font-medium",
                focusRing,
              )}
            >
              <SearchIcon />
              Search
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
