import { formatFractionalSeconds } from './format-fractional-seconds';
import { isZeroDurationTime } from './is-zero-duration-time';

/** Formats fixed duration time components as an ISO time part. */
export function formatDurationTimePart(
  hours: number,
  minutes: number,
  seconds: number,
  milliseconds: number,
): string {
  if (isZeroDurationTime(hours, minutes, seconds, milliseconds)) return 'T0S';
  const parts: string[] = [];
  if (hours > 0) parts.push(`${String(hours)}H`);
  if (minutes > 0) parts.push(`${String(minutes)}M`);
  if (seconds > 0 || milliseconds > 0)
    parts.push(`${String(seconds)}${formatFractionalSeconds(milliseconds)}S`);
  return `T${parts.join('')}`;
}
