import { resolveZonedDateTime } from './resolve-zoned-date-time';

describe('resolveZonedDateTime', () => {
  it('composes the resolved instant with its source zone metadata', () => {
    const instant = { kind: 'instant' as const, epochMilliseconds: 123 };
    const database = {
      isValid: vi.fn(),
      resolveLocalDateTime: vi.fn().mockReturnValue(instant),
      getOffsetMinutes: vi.fn().mockReturnValue(60),
    };

    expect(resolveZonedDateTime(database, 'local', 'Custom/Zone')).toEqual({
      instant,
      origin: {
        sourceTimeZone: 'Custom/Zone',
        resolvedOffsetMinutes: 60,
      },
    });
  });
});
