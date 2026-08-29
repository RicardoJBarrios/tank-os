import { isValidCalendarYear } from './is-valid-calendar-year';

it.each([
  [1, true],
  [9999, true],
  [0, false],
  [10000, false],
  [1.5, false],
  [NaN, false],
] as const)('validates calendar year %s', (value, expected) => {
  expect(isValidCalendarYear(value)).toBe(expected);
});
