import { Instant, TimeZoneDatabasePort } from '@tankos/time';
import { formatDatePipeFixedOffset } from './format-date-pipe-fixed-offset';

const OFFSET_PATTERN = /^(?<sign>[+-])(?<hours>\d{2}):?(?<minutes>\d{2})$/u;
const MINUTES_PER_HOUR = 60;
const OFFSET_COMPONENT_WIDTH = 2;

/**
 * Converts a time zone identifier into the numeric offset accepted by
 * Angular's `DatePipe` for a particular instant.
 *
 * @param timeZone - An IANA identifier, UTC, or an explicit numeric offset.
 * @param epochMilliseconds - The instant at which the offset is required.
 * @param timeZoneDatabase - IANA rules source for named zones.
 * @returns A `DatePipe`-compatible offset such as `+0100`.
 */
export function toDatePipeTimeZone(
  timeZone: string,
  epochMilliseconds: number,
  timeZoneDatabase: TimeZoneDatabasePort,
): string {
  if (timeZone === 'UTC' || timeZone === 'Z') {
    return '+0000';
  }

  const offsetMatch = OFFSET_PATTERN.exec(timeZone);
  if (offsetMatch) {
    return formatDatePipeFixedOffset(timeZone, offsetMatch);
  }

  const instant: Instant = { kind: 'instant', epochMilliseconds };
  const offsetMinutes = timeZoneDatabase.getOffsetMinutes(instant, timeZone);
  const sign = offsetMinutes < 0 ? '-' : '+';
  const absoluteMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absoluteMinutes / MINUTES_PER_HOUR)
    .toString()
    .padStart(OFFSET_COMPONENT_WIDTH, '0');
  const minutes = (absoluteMinutes % MINUTES_PER_HOUR)
    .toString()
    .padStart(OFFSET_COMPONENT_WIDTH, '0');
  return `${sign}${hours}${minutes}`;
}
