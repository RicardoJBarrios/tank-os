import { isValidCalendarDate, LocalDate } from '@tankos/time';

const LOCAL_DATE_PATTERN = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/u;

/** Parses and validates a canonical local-date string. */
export function parseLocalDateString(value: string): LocalDate {
  const match = LOCAL_DATE_PATTERN.exec(value);
  if (!match) throw new RangeError('A local date must use YYYY-MM-DD syntax');
  const groups = match.groups as Record<string, string>;
  const parsed = {
    kind: 'local-date' as const,
    year: Number(groups['year']),
    month: Number(groups['month']),
    day: Number(groups['day']),
  };
  if (!isValidCalendarDate(parsed.year, parsed.month, parsed.day))
    throw new RangeError(`Invalid local date: ${value}`);
  return parsed;
}
