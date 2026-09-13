import { getLuxonOffsetMinutes } from './get-luxon-offset-minutes';

it('returns the zone offset in whole minutes at the requested instant', () => {
  expect(
    getLuxonOffsetMinutes(
      {
        kind: 'instant',
        epochMilliseconds: Date.parse('2026-08-20T12:00:00.000Z'),
      },
      'Europe/Madrid',
    ),
  ).toBe(120);
});

it('rejects an invalid IANA zone', () => {
  expect(() =>
    getLuxonOffsetMinutes(
      { kind: 'instant', epochMilliseconds: 0 },
      'Not/A_Time_Zone',
    ),
  ).toThrow(RangeError);
});
