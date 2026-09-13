import { ComparisonResult, InstantInput } from '@tankos/time';
import { parseInstant } from './parse-instant';

const COMPARISON_LESS = -1;

/** Compares two normalized instants. */
export function compareInstants(
  left: InstantInput,
  right: InstantInput,
): ComparisonResult {
  const leftMilliseconds = parseInstant(left).epochMilliseconds;
  const rightMilliseconds = parseInstant(right).epochMilliseconds;
  if (leftMilliseconds < rightMilliseconds) return COMPARISON_LESS;
  if (leftMilliseconds > rightMilliseconds) return 1;
  return 0;
}
