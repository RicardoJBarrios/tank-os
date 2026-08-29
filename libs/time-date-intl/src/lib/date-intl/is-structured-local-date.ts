/** Detects the discriminant of a structured local date. */
export function isStructuredLocalDate(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as { kind?: unknown }).kind === 'local-date'
  );
}
