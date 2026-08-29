import { parseStructuredLocalDate } from './parse-structured-local-date';

describe('parseStructuredLocalDate', () => {
  it('returns undefined for another representation', () => {
    expect(parseStructuredLocalDate('2026-08-20')).toBeUndefined();
  });
  it('parses a valid structured date', () => {
    expect(
      parseStructuredLocalDate({
        kind: 'local-date',
        year: 2026,
        month: 8,
        day: 20,
      }),
    ).toEqual({ kind: 'local-date', year: 2026, month: 8, day: 20 });
  });
  it.each([
    { kind: 'local-date', year: '2026', month: 8, day: 20 },
    { kind: 'local-date', year: 2026, month: 2, day: 29 },
  ])('rejects invalid structured date %s', (value) => {
    expect(() => parseStructuredLocalDate(value)).toThrow(RangeError);
  });
});
