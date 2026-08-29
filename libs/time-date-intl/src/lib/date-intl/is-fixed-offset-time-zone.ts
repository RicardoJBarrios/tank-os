const FIXED_OFFSET_TIME_ZONE_PATTERN = /^[+-]\d{2}:?\d{2}$/u;

/** Returns whether a value is a numeric offset rather than an IANA zone. */
export function isFixedOffsetTimeZone(timeZone: string): boolean {
  return FIXED_OFFSET_TIME_ZONE_PATTERN.test(timeZone);
}
