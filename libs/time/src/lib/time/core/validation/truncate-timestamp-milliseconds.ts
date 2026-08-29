import { truncateMilliseconds } from './truncate-milliseconds';

const NANOSECONDS_PER_MILLISECOND = 1_000_000;
const MILLISECONDS_PER_SECOND = 1_000;

/**
 * Converts Firestore seconds and nanoseconds to canonical milliseconds.
 *
 * @param seconds - Timestamp seconds from the Unix epoch.
 * @param nanoseconds - Timestamp nanoseconds within the second.
 * @returns A safe integer epoch millisecond value truncated toward zero.
 * @throws `RangeError` when the timestamp cannot be represented safely.
 */
export function truncateTimestampMilliseconds(
  seconds: number,
  nanoseconds: number,
): number {
  return truncateMilliseconds(
    seconds * MILLISECONDS_PER_SECOND +
      nanoseconds / NANOSECONDS_PER_MILLISECOND,
  );
}
