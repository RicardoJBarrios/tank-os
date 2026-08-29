/** Converts arbitrary ISO fractional-second digits to millisecond precision. */
export function fractionToMilliseconds(value: string | undefined): number {
  return value === undefined ? 0 : Number(value.slice(0, 3).padEnd(3, '0'));
}
