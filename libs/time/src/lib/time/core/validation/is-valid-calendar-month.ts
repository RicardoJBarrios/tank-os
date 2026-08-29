/** Returns whether a value is a Gregorian calendar month. */
export function isValidCalendarMonth(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 12;
}
