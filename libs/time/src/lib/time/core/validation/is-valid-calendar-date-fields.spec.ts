import { isValidCalendarDateFields } from './is-valid-calendar-date-fields';

it.each([
  [2026, 8, 20, true],
  [0, 8, 20, false],
  [2026, 13, 20, false],
  [2026, 8, 0, false],
] as const)('validates fields %s-%s-%s', (year, month, day, expected) => {
  expect(isValidCalendarDateFields(year, month, day)).toBe(expected);
});
