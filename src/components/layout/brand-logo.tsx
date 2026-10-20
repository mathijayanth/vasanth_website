import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const LOGO_FULL = {
  src: "/images/brand/vmed-research-logo.png",
  width: 1024,
  height: 682,
  alt: "VMed Research — Mediwrite & Scientific Research Solutions",
} as const;

const LOGO_HEADER = {
  src: "/images/brand/vmed-research-logo-header.png",
  width: 1024,
  height: 520,
  alt: "VMed Research",
} as const;

const MARK = {
  src: "/images/brand/vmed-mark-crop.png",
  width: 380,
  height: 620,
  alt: "",
} as const;

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src={MARK.src}
      alt={MARK.alt}
      width={MARK.width}
      height={MARK.height}
      className={cn("h-16 w-auto object-contain sm:h-20", className)}
      aria-hidden
    />
  );
}

type BrandLogoProps = {
  inverted?: boolean;
  className?: string;
  /** Icon + wordmark only (default) or full logo with tagline. */
  variant?: "compact" | "full";
};

export function BrandLogo({ inverted = false, className, variant = "compact" }: BrandLogoProps) {
  const isFull = variant === "full";
  const logo = isFull ? LOGO_FULL : LOGO_HEADER;

  return (
    <Link
      href="/"
      className={cn("group inline-flex shrink-0 items-center", className)}
      aria-label="VMed Research home"
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        priority
        className={cn(
          "w-auto object-contain object-left transition-transform duration-500 group-hover:scale-[1.02]",
          isFull ? "h-24 sm:h-28" : "h-16 sm:h-20",
          inverted && "rounded-lg bg-white px-4 py-2 shadow-soft",
        )}
      />
    </Link>
  );
}
