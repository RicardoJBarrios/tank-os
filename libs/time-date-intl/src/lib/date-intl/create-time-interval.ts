import { InstantInput, TimeInterval } from '@tankos/time';
import { normalizeTimeInterval } from './normalize-time-interval';

/** Creates a normalized closed interval on the UTC timeline. */
export function createInterval(
  start: InstantInput,
  end: InstantInput,
): TimeInterval {
  return normalizeTimeInterval({
    start,
    end,
  });
}
