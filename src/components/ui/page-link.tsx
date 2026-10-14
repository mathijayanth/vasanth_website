import type { ComponentProps } from "react";
import Link from "next/link";

/** Public page links open in a new tab so the current page stays put. */
export function PageLink({ target = "_blank", rel = "noopener noreferrer", ...props }: ComponentProps<typeof Link>) {
  return <Link target={target} rel={rel} {...props} />;
}
