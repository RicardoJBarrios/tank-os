import { isValidCalendarDate } from '@tankos/time';

/** Validates numeric date, time and offset components of an instant. */
export function isValidInstantParts(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  offsetHours: number,
  offsetMinutes: number,
): boolean {
  return [
    isValidCalendarDate(year, month, day),
    hour >= 0,
    hour <= 23,
    minute >= 0,
    minute <= 59,
    second >= 0,
    second <= 59,
    offsetHours >= 0,
    offsetHours <= 23,
    offsetMinutes >= 0,
    offsetMinutes <= 59,
  ].every(Boolean);
}
