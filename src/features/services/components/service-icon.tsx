import { cn } from "@/lib/utils";
import type { ServiceIconName } from "../services.types";

const paths: Record<ServiceIconName, React.ReactNode> = {
  website: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M3 9h18M7 6.5h.01M10 6.5h.01M8 14h8M8 17h5" />
    </>
  ),
  disease: (
    <>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.9 2.9M15.5 15.5l2.9 2.9M5.6 18.4l2.9-2.9M15.5 8.5l2.9-2.9" />
    </>
  ),
  drug: (
    <>
      <rect x="2.8" y="8.2" width="18.4" height="7.6" rx="3.8" transform="rotate(-45 12 12)" />
      <path d="M8.6 8.6l6.8 6.8" />
    </>
  ),
  device: (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2.5" />
      <path d="M6.5 10h2.5l1.5-2.5 2 5 1.5-2.5h3.5M9 20h6M12 16v4" />
    </>
  ),
  communications: (
    <>
      <path d="M4 5h11a2 2 0 012 2v6a2 2 0 01-2 2H9l-4 3v-3H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
      <path d="M19 9h1a2 2 0 012 2v5a2 2 0 01-2 2h-1v2.5L16 18h-3" />
    </>
  ),
  seo: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M21 21l-5.5-5.5M7.5 12.5l2-2.5 2 1.5 2-3" />
    </>
  ),
  scientific: (
    <>
      <path d="M9 3h6M10 3v6L4.5 18.5A1.7 1.7 0 006 21h12a1.7 1.7 0 001.5-2.5L14 9V3" />
      <path d="M7 15h10" />
    </>
  ),
};

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-6", className)}
    >
      {paths[name]}
    </svg>
  );
}
