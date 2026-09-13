import { DateTime } from 'luxon';
import { truncateMilliseconds, type Instant } from '@tankos/time';
import { parseStructuredInstant } from './parse-structured-instant';

/** Parses Luxon ISO in UTC when no explicit zone is provided. */
export function parseInstant(value: unknown): Instant {
  if (typeof value === 'string')
    return toInstant(DateTime.fromISO(value, { zone: 'UTC' }));
  const milliseconds =
    typeof value === 'number' ? value : parseStructuredInstant(value);
  return toInstant(
    DateTime.fromMillis(truncateMilliseconds(milliseconds), { zone: 'UTC' }),
  );
}

function toInstant(date: DateTime): Instant {
  if (!date.isValid) throw new RangeError('Invalid instant');
  return { kind: 'instant', epochMilliseconds: date.toMillis() };
}
