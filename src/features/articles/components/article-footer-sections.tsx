import Link from "next/link";
import { Avatar } from "@/components/ui";
import { formatArticleDate } from "@/lib/format";
import type { ArticleReference, MedicalReviewInfo } from "../article.types";

export function MedicalReviewSection({ review }: { review: MedicalReviewInfo }) {
  return (
    <section
      aria-labelledby="medical-review-heading"
      className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
    >
      <h2 id="medical-review-heading" className="text-title text-xl">
        Medical review
      </h2>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <Avatar
          src={review.reviewer.avatarUrl}
          alt={review.reviewer.name}
          fallback={review.reviewer.name}
          size="lg"
        />
        <div>
          <p className="font-semibold text-foreground">
            Medically reviewed by{" "}
            <Link
              href={`/authors/${review.reviewer.slug}`}
              className="text-primary hover:underline"
            >
              {review.reviewer.name}
            </Link>
          </p>
          {review.reviewer.title ? (
            <p className="text-caption">{review.reviewer.title}</p>
          ) : null}
          <p className="mt-2 text-sm text-muted">
            Reviewed on {formatArticleDate(review.reviewedAt)}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            {review.note}
          </p>
        </div>
      </div>
    </section>
  );
}

export function ArticleReferencesSection({
  references,
}: {
  references: ArticleReference[];
}) {
  if (references.length === 0) return null;

  return (
    <section aria-labelledby="references-heading" className="border-t border-border pt-8">
      <h2 id="references-heading" className="text-title text-xl">
        References
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted">
        {references.map((ref) => (
          <li key={ref.id} id={ref.id}>
            {ref.href ? (
              <a
                href={ref.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {ref.label}
              </a>
            ) : (
              ref.label
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ArticleMedicalDisclaimer() {
  return (
    <aside
      aria-labelledby="medical-disclaimer-heading"
      className="rounded-2xl border border-error/25 bg-error/5 p-5 sm:p-6"
    >
      <h2 id="medical-disclaimer-heading" className="text-lg font-semibold text-foreground">
        Medical disclaimer
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">
        This content is for general informational and educational purposes only
        and is not a substitute for professional medical advice, diagnosis, or
        treatment. Always seek the advice of your physician or another qualified
        health provider with any questions regarding a medical condition. Never
        disregard professional advice or delay seeking it because of something
        you have read on VMed Research. If you think you may have a medical
        emergency, call your local emergency services immediately.
      </p>
      <p className="mt-3 text-sm text-muted">
        See our full{" "}
        <Link href="/disclaimer" className="text-primary hover:underline">
          medical disclaimer
        </Link>
        .
      </p>
    </aside>
  );
}
