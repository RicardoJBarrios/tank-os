const TIME_PART_PATTERN =
  /^T(?:(?<hours>\d+)H)?(?:(?<minutes>\d+)M)?(?:(?<seconds>\d+)(?:\.(?<fraction>\d+))?S)?$/u;
const TIME_UNIT_PATTERN = /[HMS]/u;

/** Matches an optional ISO duration time part containing at least one unit. */
export function matchIsoDurationTimePart(
  value: string | undefined,
): RegExpExecArray | undefined {
  if (value === undefined || !TIME_UNIT_PATTERN.test(value)) return undefined;
  return TIME_PART_PATTERN.exec(value) ?? undefined;
}
