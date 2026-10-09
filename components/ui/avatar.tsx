import type { ComponentProps } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type AvatarProps = ComponentProps<"div"> & {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
};

const sizeStyles = {
  sm: "size-9 text-xs",
  md: "size-11 text-sm",
  lg: "size-14 text-base",
} as const;

const imageSizes = { sm: 36, md: 44, lg: 56 } as const;

function initialsFrom(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  className,
  src,
  alt,
  fallback,
  size = "md",
  ...props
}: AvatarProps) {
  const label = fallback ?? alt;
  const initials = initialsFrom(label);

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-background font-medium text-primary",
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="size-full object-cover"
        />
      ) : (
        <span aria-hidden>{initials || "?"}</span>
      )}
    </div>
  );
}
