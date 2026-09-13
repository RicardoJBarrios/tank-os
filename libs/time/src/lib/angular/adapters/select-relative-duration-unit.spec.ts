import { selectRelativeDurationUnit } from './select-relative-duration-unit';

it.each([
  [0, 'second'],
  [59_999, 'second'],
  [60_000, 'minute'],
  [3_600_000, 'hour'],
  [86_400_000, 'day'],
] as const)('selects %s as %s', (value, unit) => {
  expect(selectRelativeDurationUnit(value)[0]).toBe(unit);
});
