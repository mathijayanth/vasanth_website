import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "./card";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card
      className={cn(
        "flex flex-col items-center px-6 py-12 text-center sm:px-10",
        className,
      )}
    >
      {icon ? (
        <div
          aria-hidden
          className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-border bg-background text-secondary"
        >
          {icon}
        </div>
      ) : null}
      <CardTitle className="text-xl">{title}</CardTitle>
      {description ? (
        <CardDescription className="mt-2 max-w-md">{description}</CardDescription>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </Card>
  );
}
