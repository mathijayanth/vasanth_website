import Image from "next/image";
import { cn } from "@/lib/utils";

type PhotoOrbProps = {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  priority?: boolean;
};

export function PhotoOrb({ src, alt, caption, className, priority }: PhotoOrbProps) {
  return (
    <figure className={cn("relative mx-auto w-full max-w-[26rem]", className)}>
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-full bg-gradient-to-br from-accent/50 via-secondary/10 to-primary/10 blur-2xl"
      />
      <div className="relative aspect-square overflow-hidden rounded-full border-[10px] border-card shadow-elevated">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 26rem, 80vw"
          className="object-cover"
          priority={priority}
        />
      </div>
      {caption ? (
        <figcaption className="pointer-events-none absolute -bottom-2 right-0 max-w-[11rem] rounded-2xl bg-card/95 px-4 py-3 text-right text-sm font-semibold leading-snug text-primary shadow-card">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
