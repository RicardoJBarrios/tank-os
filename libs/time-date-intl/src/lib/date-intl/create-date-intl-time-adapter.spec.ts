import { createDateIntlTimeAdapter } from './create-date-intl-time-adapter';

describe('create-date-intl-time-adapter', () => {
  it('Given the Date/Intl runtime, When creating an adapter, Then every composed temporal port operation is available', () => {
    const adapter = createDateIntlTimeAdapter();

    expect(adapter).toEqual(
      expect.objectContaining({
        parseInstant: expect.any(Function),
        isValidInstant: expect.any(Function),
        toUtcIsoString: expect.any(Function),
        parseDuration: expect.any(Function),
        isValidDuration: expect.any(Function),
        toDurationIsoString: expect.any(Function),
        durationBetween: expect.any(Function),
        addDuration: expect.any(Function),
        compareInstants: expect.any(Function),
        compareDurations: expect.any(Function),
        createInterval: expect.any(Function),
        contains: expect.any(Function),
        clamp: expect.any(Function),
        addLocalDate: expect.any(Function),
        durationBetweenLocalDates: expect.any(Function),
        parseLocalDate: expect.any(Function),
        isValidLocalDate: expect.any(Function),
        toLocalDateString: expect.any(Function),
        fromZonedDateTime: expect.any(Function),
        resolveZonedDateTime: expect.any(Function),
        resolveOffsetDateTime: expect.any(Function),
        isValidTimeZone: expect.any(Function),
      }),
    );
  });

  it('Given a replacement time-zone database, When resolving a zone, Then the Date/Intl adapter delegates the complete resolution to it', () => {
    const instant = { kind: 'instant' as const, epochMilliseconds: 1234 };
    const database = {
      isValid: vi.fn().mockReturnValue(true),
      resolveLocalDateTime: vi.fn().mockReturnValue(instant),
      getOffsetMinutes: vi.fn().mockReturnValue(60),
    };
    const adapter = createDateIntlTimeAdapter(database);

    expect(adapter.fromZonedDateTime('local', 'Custom/Zone')).toEqual(instant);
    expect(database.resolveLocalDateTime).toHaveBeenCalledWith(
      'local',
      'Custom/Zone',
    );
    expect(adapter.resolveZonedDateTime('local', 'Custom/Zone')).toEqual({
      instant,
      origin: {
        sourceTimeZone: 'Custom/Zone',
        resolvedOffsetMinutes: 60,
      },
    });
    expect(adapter.isValidTimeZone('Custom/Zone')).toBe(true);
  });
});
