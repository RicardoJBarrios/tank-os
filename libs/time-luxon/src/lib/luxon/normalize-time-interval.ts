import { InstantInput, TimeInterval } from '@tankos/time';
import { compareInstants } from './compare-instants';
import { parseInstant } from './parse-instant';
import { isValidTimeIntervalShape } from './is-valid-time-interval-shape';

/**
 * Validates and normalizes both boundaries of a closed time interval.
 *
 * @param interval - Candidate closed interval.
 * @returns A normalized interval whose start does not follow its end.
 * @throws `RangeError` when the shape or ordering is invalid.
 */
export function normalizeTimeInterval(
  interval: TimeIntervalInput | null,
): TimeInterval {
  if (!isValidTimeIntervalShape(interval)) {
    throw new RangeError('Invalid time interval');
  }

  const normalized = {
    start: parseInstant(interval.start),
    end: parseInstant(interval.end),
  };
  if (compareInstants(normalized.start, normalized.end) > 0) {
    throw new RangeError('An interval cannot end before it starts');
  }
  return normalized;
}
export type TimeIntervalInput = Readonly<{
  start: InstantInput;
  end: InstantInput;
}>;
