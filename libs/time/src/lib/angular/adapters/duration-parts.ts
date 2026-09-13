const SECOND = 1_000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Exact fixed-duration components used by display formatters. */
export interface DurationParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

/** Splits non-negative milliseconds into exact fixed-duration components. */
export function durationParts(milliseconds: number): DurationParts {
  let remainder = milliseconds;
  const days = Math.floor(remainder / DAY);
  remainder %= DAY;
  const hours = Math.floor(remainder / HOUR);
  remainder %= HOUR;
  const minutes = Math.floor(remainder / MINUTE);
  remainder %= MINUTE;
  const seconds = Math.floor(remainder / SECOND);
  return { days, hours, minutes, seconds, milliseconds: remainder % SECOND };
}
