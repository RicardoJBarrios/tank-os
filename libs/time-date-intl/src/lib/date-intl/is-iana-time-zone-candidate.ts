import { isFixedOffsetTimeZone } from './is-fixed-offset-time-zone';

/** Narrows a non-empty string that is not a numeric time-zone offset. */
export function isIanaTimeZoneCandidate(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  return Boolean(value) && !isFixedOffsetTimeZone(value);
}
