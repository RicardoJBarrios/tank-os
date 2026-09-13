import { parseLocalTime } from './parse-local-time';

describe('parseLocalTime', () => {
  it.each([
    ['00:00', 0, 0, 0, 0],
    ['23:59:59.999', 23, 59, 59, 999],
    ['09:08:07.1', 9, 8, 7, 100],
    ['09:08:07.12', 9, 8, 7, 120],
    ['12:30:45', 12, 30, 45, 0],
  ])(
    'parses %s without a date or zone',
    (value, hour, minute, second, millisecond) => {
      expect(parseLocalTime(String(value))).toEqual({
        kind: 'local-time',
        hour,
        minute,
        second,
        millisecond,
      });
    },
  );
  it.each([
    '24:00',
    '12:60',
    '12:00:60',
    '1:00',
    '12:00Z',
    '12:00:00.1234',
    '',
    ' 12:30 ',
    '12:30.5',
  ])('rejects %s', (value) => {
    expect(() => parseLocalTime(value)).toThrow(RangeError);
  });
  it('validates object input and returns a defensive copy', () => {
    const value = parseLocalTime('12:30');
    expect(parseLocalTime(value)).toEqual(value);
    expect(parseLocalTime(value)).not.toBe(value);
  });
  it.each([
    null,
    undefined,
    {},
    { kind: 'instant' },
    ...['hour', 'minute', 'second', 'millisecond'].flatMap((field) =>
      [-1, 1.2, NaN, Infinity, 1000].map((value) => ({
        kind: 'local-time',
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
        [field]: value,
      })),
    ),
  ])('rejects malformed values %#', (value) => {
    expect(() => parseLocalTime(value as never)).toThrow(RangeError);
  });
});
