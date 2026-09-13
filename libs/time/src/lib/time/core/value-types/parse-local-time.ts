import type { LocalTime, LocalTimeInput } from './local-time';

const LOCAL_TIME =
  /^(?<hour>\d{2}):(?<minute>\d{2})(?::(?<second>\d{2})(?:\.(?<fraction>\d{1,3}))?)?$/u;
const FIELD_LIMITS = [24, 60, 60, 1_000];

/** Validates a civil clock value without invoking a calendar runtime. */
export function parseLocalTime(value: LocalTimeInput): LocalTime {
  if (typeof value === 'string') return parseLocalTime(parseClockString(value));
  if (value?.kind !== 'local-time')
    throw new RangeError('Invalid local time kind');
  const fields = [value.hour, value.minute, value.second, value.millisecond];
  if (!fields.every((field, index) => validField(field, FIELD_LIMITS[index])))
    throw new RangeError('Invalid local time fields');
  return {
    kind: 'local-time',
    hour: value.hour,
    minute: value.minute,
    second: value.second,
    millisecond: value.millisecond,
  };
}

function validField(value: number, limit: number): boolean {
  const integer = Number.isInteger(value);
  const inRange = value >= 0 && value < limit;
  return integer && inRange;
}

function parseClockString(value: string): LocalTime {
  const match = LOCAL_TIME.exec(value);
  if (!match?.groups) throw new RangeError('Invalid local time');
  const { hour, minute, second = '0', fraction = '' } = match.groups;
  return {
    kind: 'local-time',
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
    millisecond: Number(fraction.padEnd(3, '0')),
  };
}
