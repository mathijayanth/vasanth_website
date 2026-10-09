"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "@/components/ui";

type AuthFormProps = {
  mode: "login" | "register" | "forgot" | "reset";
  resetToken?: string;
};

export function AuthForm({ mode, resetToken }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") ?? "/admin";

  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = Object.fromEntries(
      Array.from(formData.entries()).map(([key, value]) => [key, String(value)]),
    );

    try {
      let endpoint = "/api/auth/login";
      if (mode === "register") endpoint = "/api/auth/register";
      if (mode === "forgot") endpoint = "/api/auth/forgot-password";
      if (mode === "reset") endpoint = "/api/auth/reset-password";

      if (mode === "reset" && resetToken) {
        payload.token = resetToken;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as {
        success: boolean;
        message?: string;
        error?: { message?: string };
        data?: { resetUrl?: string };
      };

      if (!response.ok || !result.success) {
        setError(result.error?.message ?? "Request failed");
        return;
      }

      if (mode === "login") {
        router.push(nextPath);
        router.refresh();
        return;
      }

      if (mode === "register") {
        router.push("/login?registered=1");
        return;
      }

      if (mode === "forgot") {
        setMessage(
          result.message ??
            "If an account exists for that email, password reset instructions were sent.",
        );
        if (result.data?.resetUrl) {
          setMessage(`${result.message ?? "Development reset link:"} ${result.data.resetUrl}`);
        }
        return;
      }

      if (mode === "reset") {
        router.push("/login?reset=1");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {mode === "register" ? (
        <Input name="name" label="Full name" autoComplete="name" />
      ) : null}

      {mode !== "reset" ? (
        <Input
          name="email"
          type="email"
          label="Email"
          required
          autoComplete="email"
        />
      ) : null}

      {mode === "login" || mode === "register" || mode === "reset" ? (
        <>
          <Input
            name="password"
            type="password"
            label={mode === "reset" ? "New password" : "Password"}
            required
            autoComplete={mode === "reset" ? "new-password" : "current-password"}
          />
          {mode === "register" || mode === "reset" ? (
            <Input
              name="confirmPassword"
              type="password"
              label="Confirm password"
              required
              autoComplete="new-password"
            />
          ) : null}
        </>
      ) : null}

      {error ? (
        <p className="text-sm text-error" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-success" role="status">
          {message}
        </p>
      ) : null}

      <Button type="submit" className="w-full" isLoading={loading}>
        {mode === "login" && "Sign in"}
        {mode === "register" && "Create account"}
        {mode === "forgot" && "Send reset link"}
        {mode === "reset" && "Update password"}
      </Button>

      <div className="flex flex-col gap-2 text-center text-sm text-muted">
        {mode === "login" ? (
          <>
            <Link href="/register" className="text-primary hover:underline">
              Create an account
            </Link>
            <Link href="/forgot-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </>
        ) : null}
        {mode !== "login" ? (
          <Link href="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        ) : null}
      </div>
    </form>
  );
}
