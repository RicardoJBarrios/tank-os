import { isValidCalendarDate, LocalDate } from '@tankos/time';
import {
  CalendarFieldCandidate,
  hasNumericDateFields,
} from './has-numeric-date-fields';
import { isStructuredLocalDate } from './is-structured-local-date';

/** Parses a discriminated local-date object when present. */
export function parseStructuredLocalDate(
  value: unknown,
): LocalDate | undefined {
  if (!isStructuredLocalDate(value)) return undefined;
  const candidate = value as CalendarFieldCandidate;
  if (
    !hasNumericDateFields(candidate) ||
    !isValidCalendarDate(candidate.year, candidate.month, candidate.day)
  )
    throw new RangeError('Invalid local date');
  return {
    kind: 'local-date',
    year: candidate.year,
    month: candidate.month,
    day: candidate.day,
  };
}
