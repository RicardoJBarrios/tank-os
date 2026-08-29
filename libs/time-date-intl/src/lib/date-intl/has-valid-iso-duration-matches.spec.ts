import { hasValidIsoDurationMatches } from './has-valid-iso-duration-matches';

const match = /x/u.exec('x') ?? undefined;
it.each([
  [{}, undefined, undefined, false],
  [{ date: '1D' }, match, undefined, true],
  [{ date: 'bad' }, undefined, undefined, false],
  [{ time: 'T1H' }, undefined, match, true],
  [{ time: 'bad' }, undefined, undefined, false],
  [{ date: '1D', time: 'T1H' }, match, match, true],
] as const)(
  'validates ISO match combination',
  (texts, dateMatch, timeMatch, expected) => {
    expect(hasValidIsoDurationMatches(texts, dateMatch, timeMatch)).toBe(
      expected,
    );
  },
);
