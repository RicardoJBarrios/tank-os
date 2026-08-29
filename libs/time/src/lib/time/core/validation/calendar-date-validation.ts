import { isLeapYear } from './is-leap-year';
import { isValidCalendarDateFields } from './is-valid-calendar-date-fields';

/** Validates a proleptic Gregorian date from years 1 through 9999. */
export function isValidCalendarDate(
  year: number,
  month: number,
  day: number,
): boolean {
  if (!isValidCalendarDateFields(year, month, day)) return false;
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day <= daysInMonth[month - 1];
}
