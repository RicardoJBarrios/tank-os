import { ComparisonResult, DurationInput } from '@tankos/time';
import { parseDuration } from './parse-duration';

const COMPARISON_LESS = -1;

/** Compares two normalized elapsed durations. */
export function compareDurations(
  left: DurationInput,
  right: DurationInput,
): ComparisonResult {
  const leftMilliseconds = parseDuration(left).milliseconds;
  const rightMilliseconds = parseDuration(right).milliseconds;
  if (leftMilliseconds < rightMilliseconds) return COMPARISON_LESS;
  if (leftMilliseconds > rightMilliseconds) return 1;
  return 0;
}
