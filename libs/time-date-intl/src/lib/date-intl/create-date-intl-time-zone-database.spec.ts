import { createDateIntlTimeZoneDatabase } from './create-date-intl-time-zone-database';

describe('create-date-intl-time-zone-database', () => {
  const database = createDateIntlTimeZoneDatabase();

  it('composes the independently tested Intl TZDB operations', () => {
    expect(database.isValid('Atlantic/Canary')).toBe(true);
    expect(
      database.getOffsetMinutes(
        { kind: 'instant', epochMilliseconds: 0 },
        'UTC',
      ),
    ).toBe(0);
    expect(
      database.resolveLocalDateTime('1970-01-01T00:00:00', 'UTC'),
    ).toEqual({ kind: 'instant', epochMilliseconds: 0 });
  });
});
