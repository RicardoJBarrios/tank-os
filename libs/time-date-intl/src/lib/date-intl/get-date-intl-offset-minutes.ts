import type { Instant } from '@tankos/time';
import { getTimeZoneOffset } from './get-time-zone-offset';
import { isValidTimeZone } from './is-valid-time-zone';

const MILLISECONDS_PER_MINUTE = 60_000;

/** Returns the Intl time-zone offset in minutes at a normalized instant. */
export function getDateIntlOffsetMinutes(
  instant: Instant,
  timeZone: string,
): number {
  if (!isValidTimeZone(timeZone)) {
    throw new RangeError(`Invalid time zone: ${String(timeZone)}`);
  }
  return (
    getTimeZoneOffset(instant.epochMilliseconds, timeZone) /
    MILLISECONDS_PER_MINUTE
  );
}
