import { getLocalDateTimeParts } from './get-local-date-time-parts';

describe('getLocalDateTimeParts', () => {
  it.each([
    ['UTC', 15],
    ['Europe/Madrid', 17],
    ['Pacific/Honolulu', 5],
  ])('projects an instant into zone %s', (timeZone, hour) => {
    expect(
      getLocalDateTimeParts(Date.parse('2026-08-20T15:30:01.999Z'), timeZone),
    ).toEqual({
      year: 2026,
      month: 8,
      day: 20,
      hour,
      minute: 30,
      second: 1,
      millisecond: 0,
    });
  });
});
