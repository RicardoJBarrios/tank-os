import { parseNumericDuration } from './parse-numeric-duration';

it.each([
  [0, 0],
  [-1.9, -1],
  [1.9, 1],
] as const)('normalizes numeric duration %s', (value, expected) => {
  expect(parseNumericDuration(value).milliseconds).toBe(expected);
});
it.each([NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
  'rejects numeric duration %s',
  (value) => {
    expect(() => parseNumericDuration(value)).toThrow(RangeError);
  },
);
