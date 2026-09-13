import { DateTime } from 'luxon';
import type { LocalDateInput } from '@tankos/time';
import { parseLocalDate } from './parse-local-date';

/** Internal UTC representation of civil date fields, not an application instant. */
export function localDateToUtcDate(value: LocalDateInput): DateTime {
  const { year, month, day } = parseLocalDate(value);
  return DateTime.utc(year, month, day);
}
