import { TimePort } from '@tankos/time';
import { isValidInstant } from './is-valid-instant';
import { parseInstant } from './parse-instant';
import { toUtcIsoString } from './instant-to-utc-iso-string';
import { isValidLocalDate } from './is-valid-local-date';
import { parseLocalDate } from './parse-local-date';
import { toLocalDateString } from './local-date-to-string';
import { fromZonedDateTime } from './from-zoned-date-time';
import { resolveOffsetDateTime } from './resolve-offset-date-time';
import { resolveZonedDateTime } from './resolve-zoned-date-time';
import { createLuxonTimeZoneDatabase } from './create-luxon-time-zone-database';
import { isValidDuration } from './is-valid-duration';
import { parseDuration } from './parse-duration';
import { toDurationIsoString } from './duration-to-iso-string';
import { durationBetween } from './duration-between';
import { addDuration } from './add-duration';
import { compareDurations } from './compare-durations';
import { compareInstants } from './compare-instants';
import { clamp } from './clamp-to-time-interval';
import { createInterval } from './create-time-interval';
import { contains } from './time-interval-contains';
import { addLocalDate } from './add-local-date';
import { durationBetweenLocalDates } from './duration-between-local-dates';

/**
 * Creates the adapter backed by the Luxon runtime.
 *
 * @param timeZoneDatabase - Optional IANA rules source; defaults to Luxon.
 * @returns A complete Luxon implementation of the composed temporal ports.
 */
export function createLuxonTimeAdapter(
  timeZoneDatabase = createLuxonTimeZoneDatabase(),
): TimePort {
  return {
    parseInstant: parseInstant,
    isValidInstant: isValidInstant,
    toUtcIsoString: toUtcIsoString,
    parseDuration: parseDuration,
    isValidDuration: isValidDuration,
    toDurationIsoString: toDurationIsoString,
    durationBetween: durationBetween,
    addDuration: addDuration,
    compareInstants: compareInstants,
    compareDurations: compareDurations,
    createInterval: createInterval,
    contains: contains,
    clamp: clamp,
    addLocalDate: addLocalDate,
    durationBetweenLocalDates: durationBetweenLocalDates,
    parseLocalDate: parseLocalDate,
    isValidLocalDate: isValidLocalDate,
    toLocalDateString: toLocalDateString,
    fromZonedDateTime: fromZonedDateTime.bind(undefined, timeZoneDatabase),
    resolveZonedDateTime: resolveZonedDateTime.bind(
      undefined,
      timeZoneDatabase,
    ),
    resolveOffsetDateTime: resolveOffsetDateTime,
    isValidTimeZone: timeZoneDatabase.isValid.bind(timeZoneDatabase),
  };
}
