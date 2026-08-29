import { Instant, TimeZoneDatabasePort } from '@tankos/time';

/**
 * Resolves a local date-time in an IANA zone to a unique instant.
 *
 * @param timeZoneDatabase - Source of IANA rules.
 * @param value - Local ISO date-time without a zone designator.
 * @param timeZone - IANA time-zone identifier.
 * @returns The resolved UTC instant.
 */
export function fromZonedDateTime(
  timeZoneDatabase: TimeZoneDatabasePort,
  value: string,
  timeZone: string,
): Instant {
  return timeZoneDatabase.resolveLocalDateTime(value, timeZone);
}
