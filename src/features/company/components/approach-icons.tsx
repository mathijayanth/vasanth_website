export const approachIconNames = [
  "Understand",
  "Research",
  "Structure",
  "Write",
  "Fact-Check",
  "Reference",
  "Finalize",
] as const;

const iconClass = "size-6";

export function ApproachIcon({ name }: { name: string }) {
  switch (name) {
    case "Understand":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5.5 19c1.2-3 3.5-4.5 6.5-4.5S17.3 16 18.5 19" />
        </svg>
      );
    case "Research":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      );
    case "Structure":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="8" y="3" width="8" height="5" rx="1.2" />
          <rect x="3" y="16" width="7" height="5" rx="1.2" />
          <rect x="14" y="16" width="7" height="5" rx="1.2" />
          <path d="M12 8v4M6.5 16V13h11v3" />
        </svg>
      );
    case "Write":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 20h4L19 9l-4-4L4 16v4z" />
          <path d="M13 7l4 4" />
        </svg>
      );
    case "Fact-Check":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8" />
          <path d="M8.5 12.2l2.4 2.4 4.6-5" />
        </svg>
      );
    case "Reference":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M8 7h9M8 12h9M8 17h6" />
          <path d="M5 6v12" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 12h12" />
          <path d="M14 8l4 4-4 4" />
        </svg>
      );
  }
}
