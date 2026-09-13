import { fromZonedDateTime } from './from-zoned-date-time';

describe('fromZonedDateTime', () => {
  it('delegates local date-time resolution to the configured TZDB', () => {
    const instant = { kind: 'instant' as const, epochMilliseconds: 123 };
    const database = {
      isValid: vi.fn(),
      resolveLocalDateTime: vi.fn().mockReturnValue(instant),
      getOffsetMinutes: vi.fn(),
    };

    expect(fromZonedDateTime(database, 'local', 'Custom/Zone')).toBe(instant);
    expect(database.resolveLocalDateTime).toHaveBeenCalledWith(
      'local',
      'Custom/Zone',
    );
  });
});
