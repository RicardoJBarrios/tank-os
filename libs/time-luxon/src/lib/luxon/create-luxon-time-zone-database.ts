import { TimeZoneDatabasePort } from '@tankos/time';
import { getLuxonOffsetMinutes } from './get-luxon-offset-minutes';
import { isValidTimeZone } from './is-valid-time-zone';
import { resolveLuxonLocalDateTime } from './resolve-luxon-local-date-time';

/** Creates the IANA database adapter backed by Luxon. */
export function createLuxonTimeZoneDatabase(): TimeZoneDatabasePort {
  return {
    isValid: isValidTimeZone,
    resolveLocalDateTime: resolveLuxonLocalDateTime,
    getOffsetMinutes: getLuxonOffsetMinutes,
  };
}
