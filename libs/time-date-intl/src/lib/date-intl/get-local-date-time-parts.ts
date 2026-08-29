import { DateTimeParts } from '@tankos/time';
import { getTimeZoneFormatter } from './get-time-zone-formatter';

/** Reads second-precision calendar fields at an instant in an IANA zone. */
export function getLocalDateTimeParts(
  timestamp: number,
  timeZone: string,
): DateTimeParts {
  const parts = getTimeZoneFormatter(timeZone).formatToParts(
    new Date(timestamp),
  );
  const values = new Map(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, Number(part.value)]),
  );
  return {
    year: Number(values.get('year')),
    month: Number(values.get('month')),
    day: Number(values.get('day')),
    hour: Number(values.get('hour')),
    minute: Number(values.get('minute')),
    second: Number(values.get('second')),
    millisecond: 0,
  };
}
