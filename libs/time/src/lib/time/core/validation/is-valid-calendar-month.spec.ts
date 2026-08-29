import { isValidCalendarMonth } from './is-valid-calendar-month';

it.each([
  [1, true],
  [12, true],
  [0, false],
  [13, false],
  [1.5, false],
] as const)('validates calendar month %s', (value, expected) => {
  expect(isValidCalendarMonth(value)).toBe(expected);
});
