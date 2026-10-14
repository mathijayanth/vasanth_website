import Link from "next/link";
import { cn } from "@/lib/utils";
import { serviceHref } from "../data/service-summaries";
import type { ServiceSummary } from "../services.types";
import { ServiceIcon } from "./service-icon";

export function ServiceCard({ service, className }: { service: ServiceSummary; className?: string }) {
  return (
    <Link
      href={serviceHref(service)}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card p-7 shadow-card transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-1.5 hover:border-accent hover:shadow-elevated",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative flex items-start justify-between">
        <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-accent/40 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
          <ServiceIcon name={service.icon} className="size-7" />
        </span>
        <span className="font-mono text-sm font-semibold text-muted/60 transition-colors group-hover:text-primary">
          {service.number}
        </span>
      </div>
      <h3 className="relative mt-6 text-xl font-bold tracking-tight text-primary">{service.name}</h3>
      <p className="relative mt-3 flex-1 text-sm leading-relaxed text-muted">{service.summary}</p>
      <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        Learn more
        <svg aria-hidden viewBox="0 0 16 16" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 8h10M9 4l4 4-4 4" />
        </svg>
      </span>
    </Link>
  );
}
