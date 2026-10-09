export function formatArticleDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
