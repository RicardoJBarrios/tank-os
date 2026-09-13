import { isValidCalendarPeriodValue } from './is-valid-calendar-period-value';

it.each([
  [0, true],
  [-1, true],
  [1.5, false],
  [Infinity, false],
  [Number.MAX_SAFE_INTEGER + 1, false],
] as const)('validates calendar-period component %s', (value, expected) => {
  expect(isValidCalendarPeriodValue(value)).toBe(expected);
});
