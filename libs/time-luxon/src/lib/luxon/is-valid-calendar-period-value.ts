/** Returns whether a calendar-period component is a safe integer. */
export function isValidCalendarPeriodValue(value: number): boolean {
  return Number.isSafeInteger(value);
}
