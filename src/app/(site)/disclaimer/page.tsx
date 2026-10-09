import type { Metadata } from "next";

export const metadata: Metadata = { title: "Medical Disclaimer" };

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-display">Medical Disclaimer</h1>
      <p className="text-body mt-6 text-muted">
        VitalNotes provides general health information for educational purposes
        only. It is not a substitute for professional medical advice, diagnosis,
        or treatment. Never disregard professional medical advice or delay
        seeking it because of something you have read on this site.
      </p>
      <p className="text-body mt-4 text-muted">
        Placeholder disclaimer — finalize with clinical and legal reviewers
        before launch.
      </p>
    </main>
  );
}
