const INSTANT_PATTERN =
  /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})T(?<hour>\d{2}):(?<minute>\d{2}):(?<second>\d{2})(?:\.(?<fraction>\d+))?(?<offset>Z|[+-]\d{2}:\d{2})$/u;

/** Parses the syntactic parts of an ISO instant with an explicit offset. */
export function parseInstantParts(value: string): RegExpExecArray {
  const match = INSTANT_PATTERN.exec(value);
  if (!match)
    throw new RangeError(
      'An instant must use ISO 8601 date-time syntax with Z or an explicit offset',
    );
  return match;
}
