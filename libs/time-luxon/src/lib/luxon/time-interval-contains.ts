import { InstantInput, TimeInterval } from '@tankos/time';
import { compareInstants } from './compare-instants';
import { normalizeTimeInterval } from './normalize-time-interval';
import { parseInstant } from './parse-instant';

/** Checks membership in a closed interval, including both boundaries. */
export function contains(interval: TimeInterval, value: InstantInput): boolean {
  const normalizedInterval = normalizeTimeInterval(interval);
  const instant = parseInstant(value);
  return (
    compareInstants(normalizedInterval.start, instant) <= 0 &&
    compareInstants(instant, normalizedInterval.end) <= 0
  );
}
