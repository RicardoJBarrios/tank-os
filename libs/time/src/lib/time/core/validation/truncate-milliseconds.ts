/**
 * Truncates a finite epoch or elapsed millisecond value toward zero.
 *
 * @param value - Numeric value that may contain sub-millisecond precision.
 * @returns The safe integer millisecond representation.
 * @throws `RangeError` when the value cannot be represented safely.
 */
export function truncateMilliseconds(value: number): number {
  const milliseconds = Math.trunc(value);
  if (!Number.isFinite(value) || !Number.isSafeInteger(milliseconds)) {
    throw new RangeError('Value exceeds safe millisecond precision');
  }
  return milliseconds === 0 ? 0 : milliseconds;
}
