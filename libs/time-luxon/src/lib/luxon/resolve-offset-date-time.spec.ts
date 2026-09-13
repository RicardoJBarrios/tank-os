import { resolveOffsetDateTime } from './resolve-offset-date-time';
import { DateTime, FixedOffsetZone } from 'luxon';

describe('resolveOffsetDateTime', () => {
  it.each([1.5, 1440, -1440])(
    'uses Luxon fixed offsets without custom range rules: %s',
    (offset) => {
      const value = '2026-08-20T24:00:00';
      expect(
        resolveOffsetDateTime(value, offset).instant.epochMilliseconds,
      ).toBe(
        DateTime.fromISO(value, {
          zone: FixedOffsetZone.instance(offset),
        }).toMillis(),
      );
    },
  );
  it.each([
    [60, '2026-08-20T14:30:00.000Z'],
    [-600, '2026-08-21T01:30:00.000Z'],
    [0, '2026-08-20T15:30:00.000Z'],
  ] as const)('resolves explicit offset %s', (offset, expected) => {
    expect(
      new Date(
        resolveOffsetDateTime('2026-08-20T15:30:00', offset).instant
          .epochMilliseconds,
      ).toISOString(),
    ).toBe(expected);
  });

  it.each([Number.NaN, Infinity, -Infinity])(
    'rejects invalid explicit offset %s',
    (offset) => {
      expect(() =>
        resolveOffsetDateTime('2026-08-20T15:30:00', offset),
      ).toThrow(RangeError);
    },
  );

  it('delegates invalid local clock fields to the local parser', () => {
    expect(() => resolveOffsetDateTime('2026-08-20T25:00:00', 0)).toThrow(
      RangeError,
    );
  });
});
