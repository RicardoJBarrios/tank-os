import { matchIsoDurationDatePart } from './match-iso-duration-date-part';

it.each([
  [undefined, undefined],
  ['1D', '1'],
  ['0D', '0'],
  ['1M', undefined],
  ['', undefined],
] as const)('matches ISO date part %s', (value, expectedDays) => {
  expect(matchIsoDurationDatePart(value)?.groups?.['days']).toBe(expectedDays);
});
