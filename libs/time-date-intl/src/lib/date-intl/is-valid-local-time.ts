import { DateTimeParts } from '@tankos/time';

const MAX_MILLISECOND = 999;

/** Validates hour, minute and second fields of a parsed local time. */
export function isValidLocalTime(parts: DateTimeParts): boolean {
  return [
    parts.hour >= 0,
    parts.hour <= 23,
    parts.minute >= 0,
    parts.minute <= 59,
    parts.second >= 0,
    parts.second <= 59,
    parts.millisecond >= 0,
    parts.millisecond <= MAX_MILLISECOND,
  ].every(Boolean);
}
