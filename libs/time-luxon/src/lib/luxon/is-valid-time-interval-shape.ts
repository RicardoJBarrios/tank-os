import { TimeIntervalInput } from './normalize-time-interval';

/** Returns whether a candidate declares both closed-interval boundaries. */
export function isValidTimeIntervalShape(
  interval: TimeIntervalInput | null,
): interval is TimeIntervalInput {
  return (
    interval !== null &&
    typeof interval === 'object' &&
    'start' in interval &&
    'end' in interval
  );
}
