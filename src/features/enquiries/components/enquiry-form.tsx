"use client";

import { type FormEvent, useState } from "react";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { enquirySchema, enquiryServiceOptions } from "../enquiries.schemas";

type FieldErrors = Partial<Record<string, string>>;
type Status = "idle" | "submitting" | "success" | "error";

export function EnquiryForm({ defaultService }: { defaultService?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState("");

  const initialService = enquiryServiceOptions.some((option) => option.value === defaultService)
    ? defaultService
    : "";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form)) as Record<string, string>;

    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      form.querySelector<HTMLElement>(`[name="${String(parsed.error.issues[0]?.path[0])}"]`)?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await response.json().catch(() => null)) as
        | { success: boolean; message?: string; error?: { message?: string } }
        | null;

      if (!response.ok || !body?.success) {
        setStatus("error");
        setMessage(
          response.status === 429
            ? "You have sent several enquiries recently. Please try again in a few minutes."
            : (body?.error?.message ?? "We could not send your enquiry. Please try again."),
        );
        return;
      }

      form.reset();
      setStatus("success");
      setMessage(body.message ?? "Thank you. We have received your enquiry.");
    } catch {
      setStatus("error");
      setMessage("We could not reach the server. Please check your connection and try again.");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex animate-fade-up flex-col items-center py-12 text-center">
        <span className="relative inline-flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-elevated">
          <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-secondary/40" />
          <svg aria-hidden viewBox="0 0 24 24" className="relative size-8" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="mt-6 text-2xl font-bold">{message}</h3>
        <p className="mt-2 max-w-sm text-muted">We will review your requirements and get back to you.</p>
        <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
          Send another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={onSubmit} className="relative grid gap-5 sm:grid-cols-2">
      <Input id="enquiry-name" name="name" label="Name" placeholder="Enter your name" autoComplete="name" required error={errors.name} />
      <Input
        id="enquiry-organization"
        name="organization"
        label="Organization / Company"
        placeholder="Enter your organization"
        autoComplete="organization"
        error={errors.organization}
      />
      <Input
        id="enquiry-email"
        name="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email"
        autoComplete="email"
        required
        error={errors.email}
      />
      <Input
        id="enquiry-phone"
        name="phone"
        type="tel"
        label="Phone Number"
        placeholder="Enter your phone number"
        autoComplete="tel"
        error={errors.phone}
      />
      <div className="sm:col-span-2">
        <Select id="enquiry-service" name="service" label="Service Required" defaultValue={initialService} required error={errors.service}>
          <option value="" disabled>
            Select a service
          </option>
          {enquiryServiceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="sm:col-span-2">
        <Textarea
          id="enquiry-details"
          name="details"
          label="Project Details"
          placeholder="Tell us about your content requirements"
          rows={6}
          required
          error={errors.details}
        />
      </div>
      <div className="sm:col-span-2">
        <Input
          id="enquiry-timeline"
          name="timeline"
          label="Expected Timeline"
          placeholder="Enter your preferred timeline"
          error={errors.timeline}
        />
      </div>

      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="enquiry-website">Website</label>
        <input id="enquiry-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" ? (
        <p role="alert" className="rounded-2xl border border-error/30 bg-error/5 px-4 py-3 text-sm text-error sm:col-span-2">
          {message}
        </p>
      ) : null}

      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full sm:w-auto">
          {status === "submitting" ? "Sending…" : "Submit Enquiry"}
        </Button>
      </div>
    </form>
  );
}
