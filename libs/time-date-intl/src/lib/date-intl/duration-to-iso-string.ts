import { DurationInput } from '@tankos/time';
import { parseDuration } from './parse-duration';
import { formatDurationTimePart } from './format-duration-time-part';
import { isZeroDurationTime } from './is-zero-duration-time';

const MILLISECONDS_PER_SECOND = 1_000;
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

/** Serializes a duration as canonical fixed-unit ISO 8601. */
export function toDurationIsoString(value: DurationInput): string {
  const milliseconds = parseDuration(value).milliseconds;
  const sign = milliseconds < 0 ? '-' : '';
  let remainder = Math.abs(milliseconds);
  const days = Math.floor(remainder / MILLISECONDS_PER_DAY);
  remainder %= MILLISECONDS_PER_DAY;
  const hours = Math.floor(remainder / MILLISECONDS_PER_HOUR);
  remainder %= MILLISECONDS_PER_HOUR;
  const minutes = Math.floor(remainder / MILLISECONDS_PER_MINUTE);
  remainder %= MILLISECONDS_PER_MINUTE;
  const seconds = Math.floor(remainder / MILLISECONDS_PER_SECOND);
  const millis = remainder % MILLISECONDS_PER_SECOND;
  const datePart = days > 0 ? `${String(days)}D` : '';
  const timePart =
    days > 0 && isZeroDurationTime(hours, minutes, seconds, millis)
      ? ''
      : formatDurationTimePart(hours, minutes, seconds, millis);

  return `${sign}P${datePart}${timePart}`;
}
