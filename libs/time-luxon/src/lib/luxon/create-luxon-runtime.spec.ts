import { createLuxonRuntime } from './create-luxon-runtime';

describe('createLuxonRuntime', () => {
  it('composes a usable default Luxon runtime', () => {
    const runtime = createLuxonRuntime();

    expect(runtime.clock.now().kind).toBe('instant');
    expect(runtime.timePort.toUtcIsoString(0)).toBe('1970-01-01T00:00:00.000Z');
    expect(runtime.timeZoneDatabase.isValid('UTC')).toBe(true);
  });

  it('preserves replacement clock and time-zone database identities', () => {
    const clock = {
      now: () => ({ kind: 'instant' as const, epochMilliseconds: 123 }),
    };
    const timeZoneDatabase = {
      isValid: vi.fn().mockReturnValue(true),
      resolveLocalDateTime: vi
        .fn()
        .mockReturnValue({ kind: 'instant' as const, epochMilliseconds: 456 }),
      getOffsetMinutes: vi.fn().mockReturnValue(60),
    };

    const runtime = createLuxonRuntime({ clock, timeZoneDatabase });

    expect(runtime.clock).toBe(clock);
    expect(runtime.timeZoneDatabase).toBe(timeZoneDatabase);
    expect(runtime.timePort.fromZonedDateTime('local', 'Custom/Zone')).toEqual({
      kind: 'instant',
      epochMilliseconds: 456,
    });
  });
});
