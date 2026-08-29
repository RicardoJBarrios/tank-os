import { isLeapYear } from './is-leap-year';

it.each([
  [2024, true],
  [2025, false],
  [1900, false],
  [2000, true],
] as const)('classifies leap year %s', (year, expected) => {
  expect(isLeapYear(year)).toBe(expected);
});
