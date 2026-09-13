import { TimeZoneDatabasePort, ZonedDateTimeResolution } from '@tankos/time';
import { fromZonedDateTime } from './from-zoned-date-time';

/** Resolves a local date-time while retaining its IANA zone and offset. */
export function resolveZonedDateTime(
  timeZoneDatabase: TimeZoneDatabasePort,
  value: string,
  timeZone: string,
): ZonedDateTimeResolution {
  const instant = fromZonedDateTime(timeZoneDatabase, value, timeZone);
  return {
    instant,
    origin: {
      sourceTimeZone: timeZone,
      resolvedOffsetMinutes: timeZoneDatabase.getOffsetMinutes(
        instant,
        timeZone,
      ),
    },
  };
}
