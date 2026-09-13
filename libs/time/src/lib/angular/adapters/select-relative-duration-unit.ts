const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Selects the largest exact relative-time unit suitable for a duration. */
export function selectRelativeDurationUnit(milliseconds: number) {
  if (milliseconds >= DAY) return ['day', DAY] as const;
  if (milliseconds >= HOUR) return ['hour', HOUR] as const;
  if (milliseconds >= MINUTE) return ['minute', MINUTE] as const;
  return ['second', SECOND] as const;
}
