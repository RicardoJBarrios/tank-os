import { Duration, truncateMilliseconds } from '@tankos/time';

/** Parses finite safe numeric milliseconds as a duration. */
export function parseNumericDuration(value: number): Duration {
  if (!Number.isSafeInteger(Math.trunc(value)))
    throw new RangeError('Invalid duration');
  return { kind: 'duration', milliseconds: truncateMilliseconds(value) };
}
