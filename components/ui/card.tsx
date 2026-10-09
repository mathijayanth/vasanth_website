import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { transitionBase } from "./primitives";

type CardProps = ComponentProps<"div"> & {
  interactive?: boolean;
};

export function Card({
  className,
  interactive = false,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card p-6 shadow-card",
        transitionBase,
        interactive && "hover:border-primary/20 hover:shadow-elevated",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div className={cn("mb-4 space-y-1", className)} {...props} />;
}

export function CardTitle({
  className,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-title text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: ComponentProps<"p">) {
  return (
    <p className={cn("text-caption", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return <div className={cn("text-body text-foreground/90", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-6 flex flex-wrap items-center gap-3", className)}
      {...props}
    />
  );
}
