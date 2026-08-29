const DATE_PART_PATTERN = /^(?<days>\d+)D$/u;

/** Matches an optional fixed-day ISO duration date part. */
export function matchIsoDurationDatePart(
  value: string | undefined,
): RegExpExecArray | undefined {
  return value === undefined
    ? undefined
    : (DATE_PART_PATTERN.exec(value) ?? undefined);
}
