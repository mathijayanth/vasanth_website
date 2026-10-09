export function looksLikeCuid(value: string): boolean {
  return /^c[a-z0-9]{20,}$/i.test(value);
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
