import { isValidDurationMilliseconds } from './is-valid-duration-milliseconds';

it.each([
  [0, true],
  [-1.9, true],
  [NaN, false],
  [Infinity, false],
  ['1', false],
  [Number.MAX_SAFE_INTEGER + 1, false],
] as const)('validates duration milliseconds %s', (value, expected) => {
  expect(isValidDurationMilliseconds(value)).toBe(expected);
});
