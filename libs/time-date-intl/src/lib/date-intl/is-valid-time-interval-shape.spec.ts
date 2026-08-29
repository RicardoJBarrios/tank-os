import { isValidTimeIntervalShape } from './is-valid-time-interval-shape';

it.each([
  [{ start: 0, end: 1 }, true],
  [null, false],
  [{}, false],
  [{ start: 0 }, false],
  [{ end: 1 }, false],
] as const)('validates interval shape %s', (value, expected) => {
  expect(isValidTimeIntervalShape(value as never)).toBe(expected);
});
