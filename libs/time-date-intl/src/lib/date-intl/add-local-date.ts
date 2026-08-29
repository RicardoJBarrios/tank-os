import { CalendarPeriod, LocalDate, LocalDateInput } from '@tankos/time';
import { isValidCalendarDate } from '@tankos/time';
import { parseLocalDate } from './parse-local-date';
import { daysInMonth } from './days-in-month';
import { validateCalendarPeriod } from './validate-calendar-period';

const MONTHS_PER_YEAR = 12;

/** Adds whole calendar years, months and days to a local date. */
export function addLocalDate(
  value: LocalDateInput,
  period: CalendarPeriod | null,
): LocalDate {
  const date = parseLocalDate(value);
  validateCalendarPeriod(period);
  const years = period.years ?? 0;
  const months = period.months ?? 0;
  const days = period.days ?? 0;
  const targetMonthIndex = date.month - 1 + months;
  const targetYear =
    date.year + years + Math.floor(targetMonthIndex / MONTHS_PER_YEAR);
  const targetMonth =
    ((targetMonthIndex % MONTHS_PER_YEAR) + MONTHS_PER_YEAR) % MONTHS_PER_YEAR;
  const targetDay = Math.min(
    date.day,
    daysInMonth(targetYear, targetMonth + 1),
  );
  const result = new Date(0);
  result.setUTCFullYear(targetYear, targetMonth, targetDay);
  result.setUTCHours(0, 0, 0, 0);
  result.setUTCDate(result.getUTCDate() + days);
  const normalized = {
    kind: 'local-date' as const,
    year: result.getUTCFullYear(),
    month: result.getUTCMonth() + 1,
    day: result.getUTCDate(),
  };
  if (!isValidCalendarDate(normalized.year, normalized.month, normalized.day)) {
    throw new RangeError('Calendar period exceeds supported date range');
  }
  return normalized;
}
