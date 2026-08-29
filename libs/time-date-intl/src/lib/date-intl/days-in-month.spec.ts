import { daysInMonth } from './days-in-month';

it.each([
  [2024, 2, 29],
  [2025, 2, 28],
  [2026, 4, 30],
  [2026, 1, 31],
] as const)('returns %s-%s month length', (year, month, expected) => {
  expect(daysInMonth(year, month)).toBe(expected);
});

it.each([
  [0, 1],
  [10_000, 1],
  [2026, 0],
  [2026, 13],
] as const)('rejects invalid Gregorian year or month %s-%s', (year, month) => {
  expect(() => daysInMonth(year, month)).toThrow(RangeError);
});
