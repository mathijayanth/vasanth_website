import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-display">Contact</h1>
      <p className="text-subtitle mt-4">
        Placeholder contact page — editorial and support details will be added
        before launch.
      </p>
    </main>
  );
}
