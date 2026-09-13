import type { LocalTimeInput } from './local-time';
import { parseLocalTime } from './parse-local-time';

/** Serializes a civil clock time with millisecond precision: HH:mm:ss.SSS. */
export function toLocalTimeString(value: LocalTimeInput): string {
  const time = parseLocalTime(value);
  const clock = [time.hour, time.minute, time.second]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');
  return `${clock}.${String(time.millisecond).padStart(3, '0')}`;
}
