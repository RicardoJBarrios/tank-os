import { truncateMilliseconds } from './truncate-milliseconds';

describe('truncateMilliseconds', () => {
  it.each([
    [1.999, 1],
    [-1.999, -1],
    [0, 0],
    [-0, 0],
  ])('truncates finite value %s to %s', (value, expected) => {
    expect(truncateMilliseconds(value)).toBe(expected);
  });

  it.each([NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER * 2])(
    'rejects unsafe value %s',
    (value) => {
      expect(() => truncateMilliseconds(value)).toThrow(RangeError);
    },
  );
});
