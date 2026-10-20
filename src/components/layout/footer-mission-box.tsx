import { coreValues, mission, vision } from "@/features/company/data/company-content";

const footerCoreValues = coreValues.filter((value) =>
  ["Clarity", "Integrity", "Quality", "Trust"].includes(value.title),
);

function MissionIcon() {
  return (
    <span
      aria-hidden
      className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

function ValuesIcon() {
  return (
    <span
      aria-hidden
      className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 4l7 7-7 7-7-7 7-7z" />
      </svg>
    </span>
  );
}

export function FooterMissionBox() {
  return (
    <div className="rounded-2xl border border-border bg-card px-6 py-8 shadow-card sm:px-8 sm:py-10 lg:px-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-8">
        <div>
          <div className="flex items-center gap-3">
            <MissionIcon />
            <h2 className="text-lg font-bold text-primary">Our Mission</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{mission}</p>
        </div>

        <p className="text-sm leading-relaxed text-muted sm:text-base lg:pt-12">{vision}</p>

        <div className="lg:border-l lg:border-border lg:pl-8">
          <div className="flex items-center gap-3">
            <ValuesIcon />
            <div>
              <h2 className="text-lg font-bold text-primary">Core Values</h2>
              <p className="text-xs font-medium text-muted">What Guides Us</p>
            </div>
          </div>
          <ul className="mt-5 space-y-2 text-sm font-semibold text-primary">
            {footerCoreValues.map((value) => (
              <li key={value.title} className="flex items-center gap-2">
                <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-primary" />
                {value.title}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
