import { ZonedDateTimeResolution } from '@tankos/time';
import { createUtcTimestamp } from './create-utc-timestamp';
import { parseLocalDateTime } from './parse-local-date-time';

const MAX_OFFSET_HOURS = 23;
const MINUTES_PER_HOUR = 60;
const MAX_OFFSET_MINUTES = 59;
const MILLISECONDS_PER_MINUTE = 60_000;

/** Resolves a local date-time with a fixed numeric offset. */
export function resolveOffsetDateTime(
  value: string,
  offsetMinutes: number,
): ZonedDateTimeResolution {
  if (
    !Number.isInteger(offsetMinutes) ||
    Math.abs(offsetMinutes) >
      MAX_OFFSET_HOURS * MINUTES_PER_HOUR + MAX_OFFSET_MINUTES
  ) {
    throw new RangeError(`Invalid time-zone offset: ${String(offsetMinutes)}`);
  }

  const localAsUtc = createUtcTimestamp(parseLocalDateTime(value));
  return {
    instant: {
      kind: 'instant',
      epochMilliseconds: localAsUtc - offsetMinutes * MILLISECONDS_PER_MINUTE,
    },
    origin: {
      sourceOffsetMinutes: offsetMinutes,
      resolvedOffsetMinutes: offsetMinutes,
    },
  };
}
