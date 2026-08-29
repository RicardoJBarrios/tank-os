import { isValidCalendarDay } from './is-valid-calendar-day';

it.each([
  [1, true],
  [31, true],
  [0, false],
  [-1, false],
  [1.5, false],
] as const)('validates calendar day field %s', (value, expected) => {
  expect(isValidCalendarDay(value)).toBe(expected);
});
