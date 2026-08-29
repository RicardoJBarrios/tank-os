import { getTimeZoneFormatter } from './get-time-zone-formatter';
import { isIanaTimeZoneCandidate } from './is-iana-time-zone-candidate';

/**
 * Checks whether the runtime recognizes an IANA time-zone identifier.
 *
 * @param timeZone - IANA time-zone identifier.
 * @returns `true` when `Intl` can construct a formatter for the zone.
 */
export function isValidTimeZone(timeZone: unknown): timeZone is string {
  if (!isIanaTimeZoneCandidate(timeZone)) {
    return false;
  }

  try {
    getTimeZoneFormatter(timeZone);
    return true;
  } catch {
    return false;
  }
}
