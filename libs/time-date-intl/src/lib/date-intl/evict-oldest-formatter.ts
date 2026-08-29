/** Evicts the oldest insertion when a formatter cache exceeds its limit. */
export function evictOldestFormatter(
  cache: Map<string, Intl.DateTimeFormat>,
  limit: number,
): void {
  if (cache.size <= limit) return;
  cache.delete(String(cache.keys().next().value));
}
