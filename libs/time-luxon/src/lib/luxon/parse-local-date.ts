import { DateTime } from 'luxon';
import { isValidCalendarDate, type LocalDate } from '@tankos/time';

/** Parses Luxon ISO or neutral fields without converting a civil date's zone. */
export function parseLocalDate(value: unknown): LocalDate {
  if (typeof value === 'string')
    return toLocalDate(DateTime.fromISO(value, { zone: 'UTC', setZone: true }));
  const candidate = value as Partial<LocalDate> | null | undefined;
  if (candidate?.kind !== 'local-date')
    throw new RangeError('Invalid local date');
  const { year, month, day } = candidate;
  if (![year, month, day].every(Number.isInteger))
    throw new RangeError('Invalid local date');
  return toLocalDate(DateTime.utc(Number(year), Number(month), Number(day)));
}

function toLocalDate(date: DateTime): LocalDate {
  if (!isValidCalendarDate(date.year, date.month, date.day))
    throw new RangeError('Invalid local date');
  return {
    kind: 'local-date',
    year: date.year,
    month: date.month,
    day: date.day,
  };
}
