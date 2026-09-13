import type { Duration, LocalDateInput } from '@tankos/time';
import { localDateToUtcDate } from './local-date-to-utc-date';

/** Measures civil calendar-day distance in UTC through Luxon. */
export function durationBetweenLocalDates(
  start: LocalDateInput,
  end: LocalDateInput,
): Duration {
  return {
    kind: 'duration',
    milliseconds: localDateToUtcDate(end)
      .diff(localDateToUtcDate(start))
      .toMillis(),
  };
}
