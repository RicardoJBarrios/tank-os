import { isValidInstantParts } from './is-valid-instant-parts';

/** Asserts that syntactically parsed instant fields are within range. */
export function assertInstantParts(
  value: string,
  parts: RegExpExecArray,
): void {
  const groups = parts.groups as Record<string, string>;
  const offsetHours =
    groups['offset'] === 'Z' ? 0 : Number(groups['offset'].slice(1, 3));
  const offsetMinutes =
    groups['offset'] === 'Z' ? 0 : Number(groups['offset'].slice(4, 6));
  if (
    !isValidInstantParts(
      Number(groups['year']),
      Number(groups['month']),
      Number(groups['day']),
      Number(groups['hour']),
      Number(groups['minute']),
      Number(groups['second']),
      offsetHours,
      offsetMinutes,
    )
  )
    throw new RangeError(`Invalid instant: ${value}`);
}
