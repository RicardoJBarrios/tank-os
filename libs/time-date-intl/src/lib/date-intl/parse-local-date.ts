import { LocalDate, LocalDateInput } from '@tankos/time';
import { parseLocalDateString } from './parse-local-date-string';
import { parseStructuredLocalDate } from './parse-structured-local-date';

/**
 * Parses a calendar date without applying a time-zone conversion.
 *
 * @param value - A `YYYY-MM-DD` calendar date.
 * @returns The structured local date.
 * @throws `RangeError` when the input is not a valid calendar date.
 */
export function parseLocalDate(value: LocalDateInput): LocalDate {
  if (typeof value === 'string') return parseLocalDateString(value);
  const parsed = parseStructuredLocalDate(value);
  if (!parsed) throw new RangeError('Invalid local date');
  return parsed;
}
