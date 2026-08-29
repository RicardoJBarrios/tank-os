import { DurationInput, Instant, InstantInput } from '@tankos/time';
import { truncateMilliseconds } from '@tankos/time';
import { parseDuration } from './parse-duration';
import { parseInstant } from './parse-instant';

/** Adds an elapsed duration to an instant without changing its time zone semantics. */
export function addDuration(
  start: InstantInput,
  duration: DurationInput,
): Instant {
  const epochMilliseconds =
    parseInstant(start).epochMilliseconds +
    parseDuration(duration).milliseconds;
  return {
    kind: 'instant',
    epochMilliseconds: truncateMilliseconds(epochMilliseconds),
  };
}
