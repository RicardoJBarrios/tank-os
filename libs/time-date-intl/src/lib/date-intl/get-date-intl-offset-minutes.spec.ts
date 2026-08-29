import { getDateIntlOffsetMinutes } from './get-date-intl-offset-minutes';

it('returns the zone offset in whole minutes at the requested instant', () => {
  expect(
    getDateIntlOffsetMinutes(
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
    getDateIntlOffsetMinutes(
      { kind: 'instant', epochMilliseconds: 0 },
      'Not/A_Time_Zone',
    ),
  ).toThrow(RangeError);
});
