/** Candidate external object containing possible calendar fields. */
export interface CalendarFieldCandidate {
  year?: unknown;
  month?: unknown;
  day?: unknown;
}

/** Narrows a candidate to numeric calendar fields. */
export function hasNumericDateFields(
  candidate: CalendarFieldCandidate,
): candidate is { year: number; month: number; day: number } {
  return (
    typeof candidate.year === 'number' &&
    typeof candidate.month === 'number' &&
    typeof candidate.day === 'number'
  );
}
