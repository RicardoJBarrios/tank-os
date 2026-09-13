import { Duration, InstantInput } from '@tankos/time';
import { truncateMilliseconds } from '@tankos/time';
import { parseInstant } from './parse-instant';

/** Calculates elapsed milliseconds from the first instant to the second. */
export function durationBetween(
  start: InstantInput,
  end: InstantInput,
): Duration {
  const startMilliseconds = parseInstant(start).epochMilliseconds;
  const endMilliseconds = parseInstant(end).epochMilliseconds;
  return {
    kind: 'duration',
    milliseconds: truncateMilliseconds(endMilliseconds - startMilliseconds),
  };
}
