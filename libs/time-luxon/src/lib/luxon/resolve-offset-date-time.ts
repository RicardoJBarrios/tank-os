import { DateTime, FixedOffsetZone } from 'luxon';
import type { ZonedDateTimeResolution } from '@tankos/time';

/** Resolves ISO with a numeric offset using Luxon. */
export function resolveOffsetDateTime(
  value: string,
  offsetMinutes: number,
): ZonedDateTimeResolution {
  if (!Number.isFinite(offsetMinutes))
    throw new RangeError('Invalid time-zone offset');
  const date = DateTime.fromISO(value, {
    zone: FixedOffsetZone.instance(offsetMinutes),
  });
  if (!date.isValid) throw new RangeError('Invalid local date-time');
  return {
    instant: { kind: 'instant', epochMilliseconds: date.toMillis() },
    origin: {
      sourceOffsetMinutes: offsetMinutes,
      resolvedOffsetMinutes: date.offset,
    },
  };
}
