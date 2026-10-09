import { AuthForm } from "@/components/auth/auth-form";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-title">Forgot password</h1>
      <p className="text-subtitle mt-2">
        Enter your email and we&apos;ll send reset instructions if an account exists.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <AuthForm mode="forgot" />
      </div>
    </main>
  );
}
