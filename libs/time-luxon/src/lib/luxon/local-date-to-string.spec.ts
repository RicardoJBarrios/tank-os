import { toLocalDateString } from './local-date-to-string';

describe('local-date-to-string', () => {
  it.each([
    ['2026-08-20', '2026-08-20'],
    [{ kind: 'local-date' as const, year: 1, month: 2, day: 3 }, '0001-02-03'],
  ] as const)(
    'Given local date %s, When serializing it, Then it returns canonical date %s',
    (value, expected) => {
      expect(toLocalDateString(value)).toBe(expected);
    },
  );

  it('Given an invalid local date, When serializing it, Then it raises a range error', () => {
    expect(() => toLocalDateString('2026-02-29')).toThrow(RangeError);
  });
});
