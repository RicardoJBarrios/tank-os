import { parseLocalDate } from './parse-local-date';

describe('parse-local-date', () => {
  it('Given a valid calendar date, When parsing it, Then it preserves the calendar fields', () => {
    expect(parseLocalDate('2026-08-20')).toEqual({
      kind: 'local-date',
      year: 2026,
      month: 8,
      day: 20,
    });
  });

  it('Given a structured local date, When parsing it, Then it returns the normalized value', () => {
    const value = {
      kind: 'local-date' as const,
      year: 2026,
      month: 8,
      day: 20,
    };

    expect(parseLocalDate(value)).toEqual(value);
    expect(parseLocalDate(value)).not.toBe(value);
  });

  it('Given a structured local date with invalid fields, When parsing it, Then it raises a range error', () => {
    expect(() =>
      parseLocalDate({
        kind: 'local-date',
        year: 2026,
        month: 2,
        day: 29,
      }),
    ).toThrow(RangeError);
  });

  it.each([
    { kind: 'local-date', month: 8, day: 20 },
    { kind: 'local-date', year: 2026, day: 20 },
    { kind: 'local-date', year: 2026, month: 8 },
  ])(
    'Given a structured local date with a missing numeric field (%s), When parsing it, Then it raises a range error',
    (value) => {
      expect(() => parseLocalDate(value as never)).toThrow(RangeError);
    },
  );

  it.each([
    {},
    { year: 2026, month: 8, day: 20 },
    { kind: 'instant', year: 2026, month: 8, day: 20 },
    { kind: 'local-date', year: '2026', month: 8, day: 20 },
    null,
    undefined,
    { kind: 'local-date', year: Number.NaN, month: 8, day: 20 },
    { kind: 'local-date', year: Number.POSITIVE_INFINITY, month: 8, day: 20 },
    { kind: 'local-date', year: Number.NEGATIVE_INFINITY, month: 8, day: 20 },
  ])(
    'Given a structurally invalid local date object %s, When parsing it, Then it raises a range error',
    (value) => {
      expect(() => parseLocalDate(value as never)).toThrow(RangeError);
    },
  );

  it.each(['2026-13-01', '2026-02-29', 'not-a-date', ''])(
    'Given invalid date %s, When parsing it, Then it raises a range error',
    (value) => {
      expect(() => parseLocalDate(value)).toThrow(RangeError);
    },
  );

  it.each([' 2026-08-20', '2026-08-20 ', '2026/08/20', '2026-08-20✨'])(
    'Given a date string with whitespace or special characters (%s), When parsing it, Then it raises a range error',
    (value) => {
      expect(() => parseLocalDate(value)).toThrow(RangeError);
    },
  );
});
