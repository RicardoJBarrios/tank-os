import { Duration, LocalDateInput } from '@tankos/time';
import { parseLocalDate } from './parse-local-date';
import { localDateToUtcDate } from './local-date-to-utc-date';

/** Calculates whole calendar days as a duration between two local dates. */
export function durationBetweenLocalDates(
  start: LocalDateInput,
  end: LocalDateInput,
): Duration {
  const startDate = localDateToUtcDate(parseLocalDate(start));
  const endDate = localDateToUtcDate(parseLocalDate(end));
  return {
    kind: 'duration',
    milliseconds: endDate.getTime() - startDate.getTime(),
  };
}
