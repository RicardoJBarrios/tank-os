import { getTimeZoneOffset } from './get-time-zone-offset';

describe('getTimeZoneOffset', () => {
  it.each([
    ['UTC', '2026-08-20T15:30:01Z', 0],
    ['Europe/Madrid', '2026-08-20T15:30:01Z', 7_200_000],
    ['Europe/Madrid', '2026-01-20T15:30:01Z', 3_600_000],
    ['Pacific/Honolulu', '2026-08-20T15:30:01Z', -36_000_000],
  ])('returns the offset for %s at %s', (zone, instant, expected) => {
    expect(getTimeZoneOffset(Date.parse(instant), zone)).toBe(expected);
  });
});
