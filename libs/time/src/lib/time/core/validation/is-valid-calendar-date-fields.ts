import { isValidCalendarDay } from './is-valid-calendar-day';
import { isValidCalendarMonth } from './is-valid-calendar-month';
import { isValidCalendarYear } from './is-valid-calendar-year';

/** Validates the independent numeric ranges of Gregorian date fields. */
export function isValidCalendarDateFields(
  year: number,
  month: number,
  day: number,
): boolean {
  return (
    isValidCalendarYear(year) &&
    isValidCalendarMonth(month) &&
    isValidCalendarDay(day)
  );
}
