/** Returns whether a value can be normalized to safe integer milliseconds. */
export function isValidDurationMilliseconds(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(Math.trunc(value));
}
