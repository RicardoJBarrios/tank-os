const MAX_CALENDAR_YEAR = 9999;

/** Returns whether a value is a supported proleptic Gregorian year. */
export function isValidCalendarYear(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= MAX_CALENDAR_YEAR;
}
