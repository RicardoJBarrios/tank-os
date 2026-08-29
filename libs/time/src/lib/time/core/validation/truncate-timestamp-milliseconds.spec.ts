import { truncateTimestampMilliseconds } from './truncate-timestamp-milliseconds';

describe('truncateTimestampMilliseconds', () => {
  it.each([
    [1, 999_999_999, 1_999],
    [-1, 999_999_999, 0],
    [-2, 1, -1_999],
  ])(
    'converts seconds %s and nanoseconds %s to %s milliseconds',
    (seconds, nanoseconds, expected) => {
      expect(truncateTimestampMilliseconds(seconds, nanoseconds)).toBe(
        expected,
      );
    },
  );

  it('rejects a timestamp outside safe millisecond precision', () => {
    expect(() =>
      truncateTimestampMilliseconds(Number.MAX_SAFE_INTEGER, 0),
    ).toThrow(RangeError);
  });
});
