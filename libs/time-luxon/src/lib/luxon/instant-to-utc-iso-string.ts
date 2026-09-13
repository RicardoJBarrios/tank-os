import { DateTime } from 'luxon';
import type { InstantInput } from '@tankos/time';
import { parseInstant } from './parse-instant';

/** Serializes validated instants with Luxon's UTC ISO representation. */
export function toUtcIsoString(value: InstantInput): string {
  return String(
    DateTime.fromMillis(parseInstant(value).epochMilliseconds, {
      zone: 'UTC',
    }).toISO(),
  );
}
