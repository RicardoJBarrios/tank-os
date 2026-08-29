import { resolveOffsetDateTime } from './resolve-offset-date-time';

describe('resolveOffsetDateTime', () => {
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

  it.each([1.5, 1_440, -1_440, Number.NaN])(
    'rejects invalid explicit offset %s',
    (offset) => {
      expect(() =>
        resolveOffsetDateTime('2026-08-20T15:30:00', offset),
      ).toThrow(RangeError);
    },
  );

  it('delegates invalid local clock fields to the local parser', () => {
    expect(() => resolveOffsetDateTime('2026-08-20T24:00:00', 0)).toThrow(
      RangeError,
    );
  });
});
