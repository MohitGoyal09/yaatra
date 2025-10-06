export function formatDistanceToNow(
  date: Date,
  options?: { addSuffix?: boolean }
): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return options?.addSuffix ? "just now" : "now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    const suffix = options?.addSuffix ? " ago" : "";
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"}${suffix}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    const suffix = options?.addSuffix ? " ago" : "";
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"}${suffix}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    const suffix = options?.addSuffix ? " ago" : "";
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"}${suffix}`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    const suffix = options?.addSuffix ? " ago" : "";
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"}${suffix}`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    const suffix = options?.addSuffix ? " ago" : "";
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"}${suffix}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  const suffix = options?.addSuffix ? " ago" : "";
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"}${suffix}`;
}
