import { assertInstantParts } from './assert-instant-parts';
import { parseInstantParts } from './parse-instant-parts';

it('accepts valid Z and explicit offsets', () => {
  expect(() =>
    { assertInstantParts(
      '2026-08-20T15:30:00Z',
      parseInstantParts('2026-08-20T15:30:00Z'),
    ); },
  ).not.toThrow();
  expect(() =>
    { assertInstantParts(
      '2026-08-20T15:30:00+01:30',
      parseInstantParts('2026-08-20T15:30:00+01:30'),
    ); },
  ).not.toThrow();
});
it.each([
  '2026-02-29T15:30:00Z',
  '2026-08-20T24:30:00Z',
  '2026-08-20T15:30:00+24:00',
])('rejects invalid fields in %s', (value) => {
  expect(() => { assertInstantParts(value, parseInstantParts(value)); }).toThrow(
    RangeError,
  );
});
