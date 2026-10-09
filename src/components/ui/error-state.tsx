"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardTitle } from "./card";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  action?: ReactNode;
  className?: string;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  action,
  className,
}: ErrorStateProps) {
  return (
    <Card
      role="alert"
      className={cn(
        "border-error/30 bg-error/5 px-6 py-10 text-center sm:px-10",
        className,
      )}
    >
      <CardTitle className="text-xl text-error">{title}</CardTitle>
      <CardDescription className="mx-auto mt-2 max-w-md text-foreground/80">
        {message}
      </CardDescription>
      <CardContent className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button variant="danger" onClick={onRetry}>
            {retryLabel}
          </Button>
        ) : null}
        {action}
      </CardContent>
    </Card>
  );
}
