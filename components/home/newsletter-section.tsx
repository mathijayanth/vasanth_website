"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui";
import { fieldStyles } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function NewsletterSection() {
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="border-y border-border bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-6 text-center shadow-card sm:p-10">
          <p className="text-overline">Newsletter</p>
          <h2 className="text-title mt-3">Stay informed about your health.</h2>
          <p className="text-subtitle mt-3">
            Placeholder signup — API integration arrives in a later phase.
          </p>
          {submitted ? (
            <p className="mt-6 text-sm font-medium text-success" role="status">
              Thanks! We&apos;ll be in touch when subscriptions go live.
            </p>
          ) : (
            <form
              onSubmit={onSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className={cn(fieldStyles, "sm:flex-1")}
              />
              <Button type="submit" className="w-full shrink-0 sm:w-auto">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
