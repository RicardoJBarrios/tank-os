import { Duration as LuxonDuration } from 'luxon';
import {
  truncateMilliseconds,
  type Duration,
  type DurationInput,
} from '@tankos/time';
import { parseNumericDuration } from './parse-numeric-duration';
import { parseObjectDuration } from './parse-object-duration';

/** Parses Luxon ISO durations, converting to elapsed milliseconds with its defaults. */
export function parseDuration(value: DurationInput): Duration {
  if (typeof value === 'number') return parseNumericDuration(value);
  if (typeof value !== 'string') return parseObjectDuration(value);
  const parsed = LuxonDuration.fromISO(value);
  if (!parsed.isValid) throw new RangeError('Invalid ISO 8601 duration');
  return {
    kind: 'duration',
    milliseconds: truncateMilliseconds(parsed.toMillis()),
  };
}
