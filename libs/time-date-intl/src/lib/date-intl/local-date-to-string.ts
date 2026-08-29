import { LocalDateInput } from '@tankos/time';
import { parseLocalDate } from './parse-local-date';

/** Serializes a calendar date without applying a time zone. */
export function toLocalDateString(value: LocalDateInput): string {
  const date = parseLocalDate(value);
  return `${date.year.toString().padStart(4, '0')}-${date.month
    .toString()
    .padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
}
