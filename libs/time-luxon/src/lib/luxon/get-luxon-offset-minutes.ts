import { DateTime } from 'luxon';
import type { Instant } from '@tankos/time';
import { parseInstant } from './parse-instant';
import { isValidTimeZone } from './is-valid-time-zone';

/** Reads the instant-specific offset from Luxon. */
export function getLuxonOffsetMinutes(
  instant: Instant,
  timeZone: string,
): number {
  if (!isValidTimeZone(timeZone)) throw new RangeError('Invalid time zone');
  return DateTime.fromMillis(parseInstant(instant).epochMilliseconds, {
    zone: timeZone,
  }).offset;
}
