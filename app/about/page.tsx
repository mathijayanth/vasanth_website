import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-display">About VitalNotes</h1>
      <p className="text-subtitle mt-4">
        Placeholder about page for the medical editorial platform. Mission,
        editorial standards, and reviewer policies will be published here.
      </p>
    </main>
  );
}
