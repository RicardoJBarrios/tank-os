import { createUtcTimestamp } from './create-utc-timestamp';
import { getLocalDateTimeParts } from './get-local-date-time-parts';

const MILLISECONDS_PER_SECOND = 1_000;

/** Calculates the IANA zone offset applicable at a timestamp. */
export function getTimeZoneOffset(timestamp: number, timeZone: string): number {
  const localParts = getLocalDateTimeParts(timestamp, timeZone);
  return (
    createUtcTimestamp(localParts) -
    Math.floor(timestamp / MILLISECONDS_PER_SECOND) * MILLISECONDS_PER_SECOND
  );
}
