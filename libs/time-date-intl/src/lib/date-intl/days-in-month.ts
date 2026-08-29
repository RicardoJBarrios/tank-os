import {
  isLeapYear,
  isValidCalendarMonth,
  isValidCalendarYear,
} from '@tankos/time';

/** Returns the number of days in a proleptic Gregorian month. */
export function daysInMonth(year: number, month: number): number {
  if (![isValidCalendarYear(year), isValidCalendarMonth(month)].every(Boolean)) {
    throw new RangeError(
      `Invalid Gregorian year or month: ${String(year)}-${String(month)}`,
    );
  }
  if (month === 2) return 28 + Number(isLeapYear(year));
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}
