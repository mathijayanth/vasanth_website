import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton, canAccessAdmin, canAccessAdminPath } from "@/features/auth";
import { getSessionUser } from "@/features/auth/server/session";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/articles", label: "Articles" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/authors", label: "Authors" },
];

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login?next=/admin");
  }
  if (!canAccessAdmin(user.role)) {
    redirect("/");
  }

  return (
    <div className="flex flex-1 flex-col border-t border-border bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-semibold text-foreground">Admin</p>
            <p className="text-caption">
              {user.name ?? user.email} · {user.role}
            </p>
          </div>
          <nav aria-label="Admin" className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              if (!canAccessAdminPath(item.href, user.role)) return null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium hover:border-primary/30"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  );
}
