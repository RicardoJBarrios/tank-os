import { DateTimeParts } from '@tankos/time';
import { isValidLocalTime } from './is-valid-local-time';

const base: DateTimeParts = {
  year: 2026,
  month: 8,
  day: 20,
  hour: 0,
  minute: 0,
  second: 0,
  millisecond: 0,
};
it.each([
  ['hour', 23, true],
  ['hour', 24, false],
  ['minute', 59, true],
  ['minute', 60, false],
  ['second', 59, true],
  ['second', 60, false],
  ['millisecond', 999, true],
  ['millisecond', 1_000, false],
  ['hour', -1, false],
  ['minute', -1, false],
  ['second', -1, false],
  ['millisecond', -1, false],
] as const)('validates %s %s', (field, value, expected) => {
  expect(isValidLocalTime({ ...base, [field]: value })).toBe(expected);
});
