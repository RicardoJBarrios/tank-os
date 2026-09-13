import { toDatePipeTimeZone } from './angular-time-zone-offset';
import type { TimeZoneDatabasePort } from '@tankos/time';

describe('angular-time-zone-offset', () => {
  const timeZoneDatabase = {
    getOffsetMinutes: vi.fn().mockReturnValue(0),
  } as unknown as TimeZoneDatabasePort;

  it.each([
    ['UTC', '+0000'],
    ['Z', '+0000'],
    ['+01:30', '+0130'],
    ['-0430', '-0430'],
  ])(
    'Given a direct timezone value %s, When converting it for DatePipe, Then it returns %s',
    (timeZone, expected) => {
      expect(toDatePipeTimeZone(timeZone, 0, timeZoneDatabase)).toBe(expected);
    },
  );

  it('Given an IANA timezone east of UTC, When converting it for DatePipe, Then it formats the database offset', () => {
    vi.mocked(timeZoneDatabase.getOffsetMinutes).mockReturnValueOnce(120);
    expect(
      toDatePipeTimeZone(
        'Europe/Madrid',
        Date.parse('2026-08-20T12:00:00.000Z'),
        timeZoneDatabase,
      ),
    ).toBe('+0200');
  });

  it('Given an IANA timezone west of UTC, When converting it for DatePipe, Then it returns a negative offset', () => {
    vi.mocked(timeZoneDatabase.getOffsetMinutes).mockReturnValueOnce(-300);
    expect(
      toDatePipeTimeZone(
        'America/New_York',
        Date.parse('2026-01-20T12:00:00.000Z'),
        timeZoneDatabase,
      ),
    ).toBe('-0500');
  });

  it('Given a replacement timezone database, When converting an IANA zone, Then it uses that database offset', () => {
    const database = {
      isValid: vi.fn().mockReturnValue(true),
      resolveLocalDateTime: vi.fn(),
      getOffsetMinutes: vi.fn().mockReturnValue(120),
    };

    expect(toDatePipeTimeZone('Custom/Zone', 0, database)).toBe('+0200');
    expect(database.getOffsetMinutes).toHaveBeenCalledWith(
      { kind: 'instant', epochMilliseconds: 0 },
      'Custom/Zone',
    );
  });

  it.each(['+24:00', '-01:60'])(
    'Given an invalid fixed offset %s, When converting it, Then it raises a range error',
    (timeZone) => {
      expect(() => toDatePipeTimeZone(timeZone, 0, timeZoneDatabase)).toThrow(
        RangeError,
      );
    },
  );
});
