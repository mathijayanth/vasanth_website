import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-title">Create account</h1>
      <p className="text-subtitle mt-2">
        Register as a reader to save articles. Staff roles are assigned by an administrator.
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        <AuthForm mode="register" />
      </div>
    </main>
  );
}
