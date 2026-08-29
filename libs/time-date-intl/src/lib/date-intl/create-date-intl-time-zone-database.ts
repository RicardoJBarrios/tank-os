import { TimeZoneDatabasePort } from '@tankos/time';
import { getDateIntlOffsetMinutes } from './get-date-intl-offset-minutes';
import { isValidTimeZone } from './is-valid-time-zone';
import { resolveDateIntlLocalDateTime } from './resolve-date-intl-local-date-time';

/** Creates the IANA database adapter backed by the runtime's `Intl` TZDB. */
export function createDateIntlTimeZoneDatabase(): TimeZoneDatabasePort {
  return {
    isValid: isValidTimeZone,
    resolveLocalDateTime: resolveDateIntlLocalDateTime,
    getOffsetMinutes: getDateIntlOffsetMinutes,
  };
}
