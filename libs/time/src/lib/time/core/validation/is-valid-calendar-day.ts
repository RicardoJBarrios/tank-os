/** Returns whether a value can be a positive calendar day field. */
export function isValidCalendarDay(value: number): boolean {
  return Number.isInteger(value) && value >= 1;
}
