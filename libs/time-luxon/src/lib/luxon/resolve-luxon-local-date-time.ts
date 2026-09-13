import { DateTime } from 'luxon';
import type { Instant } from '@tankos/time';
import { isValidTimeZone } from './is-valid-time-zone';

/** Resolves ISO with Luxon's default DST gap and overlap behavior. */
export function resolveLuxonLocalDateTime(
  value: string,
  timeZone: string,
): Instant {
  if (!isValidTimeZone(timeZone)) throw new RangeError('Invalid time zone');
  const date = DateTime.fromISO(value, { zone: timeZone });
  if (!date.isValid) throw new RangeError('Invalid local date-time');
  return { kind: 'instant', epochMilliseconds: date.toMillis() };
}
