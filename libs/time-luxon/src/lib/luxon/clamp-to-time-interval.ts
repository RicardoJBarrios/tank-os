import { Instant, InstantInput, TimeInterval } from '@tankos/time';
import { compareInstants } from './compare-instants';
import { normalizeTimeInterval } from './normalize-time-interval';
import { parseInstant } from './parse-instant';

/** Clamps an instant to the nearest boundary of a closed interval. */
export function clamp(value: InstantInput, interval: TimeInterval): Instant {
  const normalizedInterval = normalizeTimeInterval(interval);
  const instant = parseInstant(value);
  if (compareInstants(instant, normalizedInterval.start) < 0) {
    return normalizedInterval.start;
  }
  if (compareInstants(instant, normalizedInterval.end) > 0) {
    return normalizedInterval.end;
  }
  return instant;
}
