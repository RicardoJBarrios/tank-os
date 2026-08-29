import { parseLocalDateString } from './parse-local-date-string';

it('parses a canonical local date', () => {
  expect(parseLocalDateString('2026-08-20')).toEqual({
    kind: 'local-date',
    year: 2026,
    month: 8,
    day: 20,
  });
});
it.each(['', '2026-8-20', '2026-02-29', '2026-13-01'])(
  'rejects invalid local date %s',
  (value) => {
    expect(() => parseLocalDateString(value)).toThrow(RangeError);
  },
);
