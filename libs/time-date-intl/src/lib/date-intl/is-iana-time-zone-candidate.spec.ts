import { isIanaTimeZoneCandidate } from './is-iana-time-zone-candidate';

it.each([
  ['Atlantic/Canary', true],
  ['UTC', true],
  ['', false],
  ['+01:00', false],
  [undefined, false],
] as const)('narrows IANA time-zone candidate %s', (value, expected) => {
  expect(isIanaTimeZoneCandidate(value)).toBe(expected);
});
