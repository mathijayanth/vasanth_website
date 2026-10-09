import { AuthForm } from "@/components/auth/auth-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = params.token ?? "";

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16 sm:px-6">
      <h1 className="text-title">Reset password</h1>
      <p className="text-subtitle mt-2">Choose a new password for your account.</p>
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-soft">
        {token ? (
          <AuthForm mode="reset" resetToken={token} />
        ) : (
          <p className="text-sm text-error" role="alert">
            Reset token is missing or invalid. Request a new link from the forgot password page.
          </p>
        )}
      </div>
    </main>
  );
}
