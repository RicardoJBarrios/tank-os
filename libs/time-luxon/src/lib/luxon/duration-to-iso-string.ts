import { Duration } from 'luxon';
import type { DurationInput } from '@tankos/time';
import { parseDuration } from './parse-duration';

/** Serializes elapsed time using Luxon's ISO representation. */
export function toDurationIsoString(value: DurationInput): string {
  return Duration.fromMillis(parseDuration(value).milliseconds).toISO();
}
