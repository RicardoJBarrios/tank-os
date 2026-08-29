const DAY = 86_400_000;

/** Selects an explicitly approximate month or year for long durations. */
export function selectApproximateCalendarUnit(milliseconds: number) {
  if (milliseconds < 30 * DAY) return undefined;
  if (milliseconds >= 365 * DAY) return ['year', 365 * DAY] as const;
  return ['month', 30 * DAY] as const;
}
