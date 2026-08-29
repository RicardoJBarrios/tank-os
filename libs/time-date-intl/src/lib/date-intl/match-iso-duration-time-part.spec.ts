import { matchIsoDurationTimePart } from './match-iso-duration-time-part';

it.each([
  [undefined, undefined],
  ['T1H2M3.45S', '1'],
  ['T30M', undefined],
  ['T', undefined],
  ['T.5S', undefined],
  ['T1M2H', undefined],
] as const)('matches ISO time part %s', (value, expectedHours) => {
  expect(matchIsoDurationTimePart(value)?.groups?.['hours']).toBe(
    expectedHours,
  );
});
