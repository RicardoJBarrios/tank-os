import { isFixedOffsetTimeZone } from './is-fixed-offset-time-zone';

it.each([
  ['+01:00', true],
  ['-0430', true],
  ['UTC', false],
  ['Atlantic/Canary', false],
] as const)('classifies fixed offset time zone %s', (value, expected) => {
  expect(isFixedOffsetTimeZone(value)).toBe(expected);
});
