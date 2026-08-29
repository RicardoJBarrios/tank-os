import { selectApproximateCalendarUnit } from './select-approximate-calendar-unit';

it.each([
  [29 * 86_400_000, undefined],
  [30 * 86_400_000, 'month'],
  [365 * 86_400_000, 'year'],
] as const)('selects the approximate unit at %s', (value, unit) => {
  expect(selectApproximateCalendarUnit(value)?.[0]).toBe(unit);
});
