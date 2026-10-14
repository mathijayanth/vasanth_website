"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PageLink as Link } from "@/components/ui/page-link";
import { usePathname } from "next/navigation";
import { focusRing, touchTarget } from "@/components/ui/primitives";
import { primaryNavLinks } from "@/config/site";
import { ServiceIcon, serviceHref, serviceSummaries } from "@/features/services";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./brand-logo";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function ServicesMenu({ active }: { active: boolean }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    const onClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors",
          active || open ? "text-foreground" : "text-muted hover:text-foreground",
          focusRing,
        )}
      >
        Services
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      <div
        id={menuId}
        className={cn(
          "absolute left-1/2 top-full w-[min(44rem,90vw)] -translate-x-1/2 pt-3 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
        )}
      >
        <div
          onClick={(event) => (event.target as HTMLElement).closest("a") && setOpen(false)}
          className="overflow-hidden rounded-3xl border border-border bg-card/95 p-3 shadow-elevated backdrop-blur-xl"
        >
          <ul className="grid gap-1 sm:grid-cols-2">
            {serviceSummaries.map((service) => (
              <li key={service.slug}>
                <Link
                  href={serviceHref(service)}
                  className={cn(
                    "group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-background",
                    focusRing,
                  )}
                >
                  <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 text-primary transition-colors group-hover:from-primary group-hover:to-secondary group-hover:text-white">
                    <ServiceIcon name={service.icon} className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-foreground">{service.name}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted">
                      {service.tagline}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/services"
            className={cn(
              "mt-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-primary/5 to-secondary/5 px-4 py-3 text-sm font-semibold text-primary",
              focusRing,
            )}
          >
            View all services
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-background/80 backdrop-blur-xl">
      <div
        className={cn(
          "mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 transition-shadow duration-500 sm:px-6 lg:px-8",
          scrolled && "shadow-[0_1px_0_0_var(--border)]",
        )}
      >
        <BrandLogo />

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-1 lg:flex">
          {primaryNavLinks.map((link) =>
            link.href === "/services" ? (
              <ServicesMenu key={link.href} active={isActive(pathname, link.href)} />
            ) : (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(pathname, link.href) ? "page" : undefined}
                className={cn(
                  "relative inline-flex min-h-11 items-center rounded-full px-4 text-sm font-semibold transition-colors",
                  isActive(pathname, link.href) ? "text-foreground" : "text-muted hover:text-foreground",
                  focusRing,
                )}
              >
                {link.label}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-4 bottom-2 h-0.5 origin-left rounded-full bg-gradient-to-r from-primary to-secondary transition-transform duration-300",
                    isActive(pathname, link.href) ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            ),
          )}
        </nav>

        <Link
          href="/contact"
          className={cn(
            "group ml-auto hidden items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:bg-secondary hover:shadow-elevated sm:inline-flex lg:ml-2",
            touchTarget,
            focusRing,
          )}
        >
          Start a Project
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </Link>

        <button
          type="button"
          className={cn(
            "ml-auto inline-flex items-center justify-center rounded-full border border-border bg-card sm:ml-0 lg:hidden",
            touchTarget,
            focusRing,
          )}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden className="relative block h-3.5 w-5">
            <span className={cn("absolute left-0 top-0 h-0.5 w-5 rounded bg-foreground transition-all duration-300", menuOpen && "top-1.5 rotate-45")} />
            <span className={cn("absolute left-0 top-1.5 h-0.5 w-5 rounded bg-foreground transition-opacity duration-300", menuOpen && "opacity-0")} />
            <span className={cn("absolute left-0 top-3 h-0.5 w-5 rounded bg-foreground transition-all duration-300", menuOpen && "top-1.5 -rotate-45")} />
          </span>
        </button>
      </div>

      <div
        id={menuId}
        className={cn("fixed inset-0 z-40 lg:hidden", menuOpen ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu overlay"
          className={cn(
            "absolute inset-0 bg-foreground/40 backdrop-blur-sm transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setMenuOpen(false)}
        />
        <div
          onClick={(event) => (event.target as HTMLElement).closest("a") && setMenuOpen(false)}
          className={cn(
            "absolute right-0 top-0 flex h-full w-[min(100%,22rem)] flex-col overflow-y-auto bg-card shadow-elevated transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            menuOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-20 items-center justify-between border-b border-border px-5">
            <BrandLogo />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className={cn(touchTarget, focusRing, "rounded-full px-3 text-sm font-medium text-muted")}
            >
              Close
            </button>
          </div>
          <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
            {primaryNavLinks.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-2xl px-4 py-3 text-lg font-semibold transition-all duration-500",
                  isActive(pathname, link.href) ? "bg-background text-primary" : "text-foreground hover:bg-background",
                  menuOpen ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
                  ["delay-75", "delay-100", "delay-150", "delay-200", "delay-300"][index],
                  focusRing,
                )}
              >
                {link.label}
              </Link>
            ))}
            <p className="mt-4 px-4 text-overline">Services</p>
            {serviceSummaries.map((service) => (
              <Link
                key={service.slug}
                href={serviceHref(service)}
                className={cn("flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-background", focusRing)}
              >
                <ServiceIcon name={service.icon} className="size-5 text-primary" />
                {service.name}
              </Link>
            ))}
            <Link
              href="/contact"
              className={cn(
                "mt-4 inline-flex items-center justify-center rounded-full bg-primary px-5 font-semibold text-white shadow-soft",
                touchTarget,
                focusRing,
              )}
            >
              Start a Project
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
