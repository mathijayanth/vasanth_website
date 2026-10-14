const iconClass = "size-6";

export function AudienceIcon({ title }: { title: string }) {
  switch (title) {
    case "Healthcare Organizations":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 21V9l9-6 9 6v12" />
          <path d="M9 21v-7h6v7" />
        </svg>
      );
    case "Doctors & Healthcare Professionals":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="7" r="3" />
          <path d="M5 20c1.2-3.5 3.8-5 7-5s5.8 1.5 7 5" />
        </svg>
      );
    case "Pharmaceutical Companies":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="8" width="18" height="8" rx="4" transform="rotate(-35 12 12)" />
          <path d="M8.5 8.5l7 7" />
        </svg>
      );
    case "Medical Device Companies":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
        </svg>
      );
    case "CROs & Clinical Research Organizations":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 3h6M10 3v6L4.8 18.2A1.6 1.6 0 006.2 21h11.6a1.6 1.6 0 001.4-2.8L14 9V3" />
        </svg>
      );
    case "Health-Tech & Digital Health Companies":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      );
    case "Diagnostics & Laboratory Organizations":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 19V7l8-4 8 4v12" />
          <path d="M9 21h6" />
        </svg>
      );
  }
}

export function WhyIcon({ title }: { title: string }) {
  switch (title) {
    case "Medical Understanding":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v5M12 16h.01" />
        </svg>
      );
    case "Evidence-Based Content":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 4h9l5 5v11H6z" />
          <path d="M15 4v5h5M9 13h6M9 17h4" />
        </svg>
      );
    case "Audience-Focused Communication":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h11a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 3v-3H4a2 2 0 01-2-2V8a2 2 0 012-2z" />
        </svg>
      );
    case "Clear & Structured Writing":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M5 7h14M5 12h14M5 17h9" />
        </svg>
      );
    case "Healthcare SEO Understanding":
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="6" />
          <path d="M20 20l-3.6-3.6" />
        </svg>
      );
    default:
      return (
        <svg aria-hidden viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 3l2.2 6.6H21l-5.4 4 2.1 6.4L12 16.6 6.3 20l2.1-6.4L3 9.6h6.8z" />
        </svg>
      );
  }
}
