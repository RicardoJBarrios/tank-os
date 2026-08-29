import { formatDatePipeFixedOffset } from './format-date-pipe-fixed-offset';

const pattern = /^(?<sign>[+-])(?<hours>\d{2}):?(?<minutes>\d{2})$/u;

describe('formatDatePipeFixedOffset', () => {
  it.each([
    ['+05:30', '+0530'],
    ['-10:00', '-1000'],
    ['+2359', '+2359'],
  ] as const)('normalizes %s', (value, expected) => {
    const match = pattern.exec(value);
    if (!match) throw new Error('The test offset must match the test pattern');
    expect(formatDatePipeFixedOffset(value, match)).toBe(expected);
  });
  it.each(['+24:00', '+10:60'])(
    'rejects the out-of-range offset %s',
    (value) => {
      const match = pattern.exec(value);
      if (!match)
        throw new Error('The test offset must match the test pattern');
      expect(() => formatDatePipeFixedOffset(value, match)).toThrow(RangeError);
    },
  );
});
