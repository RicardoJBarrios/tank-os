import type { CalendarPeriod, LocalDate, LocalDateInput } from '@tankos/time';
import { localDateToUtcDate } from './local-date-to-utc-date';
import { parseLocalDate } from './parse-local-date';
import { validateCalendarPeriod } from './validate-calendar-period';

/** Delegates calendar addition and month-end handling to Luxon. */
export function addLocalDate(
  value: LocalDateInput,
  period: CalendarPeriod | null,
): LocalDate {
  validateCalendarPeriod(period);
  const date = localDateToUtcDate(value).plus(period);
  return parseLocalDate({
    kind: 'local-date',
    year: date.year,
    month: date.month,
    day: date.day,
  });
}
