import { isValidInstant } from './is-valid-instant';

describe('is-valid-instant', () => {
  it('Given a valid ISO instant, When validating it, Then it returns true', () => {
    expect(isValidInstant('2026-08-20T15:30:00Z')).toBe(true);
  });

  it('Given a local date-time, When validating it, Then it returns false', () => {
    expect(isValidInstant('2026-08-20T15:30:00')).toBe(false);
  });

  it.each([
    '',
    ' 2026-08-20T15:30:00Z',
    '2026-08-20T15:30:00Z ',
    '2026/08/20T15:30:00Z',
    '2026-08-20T15:30:00Z✨',
    {},
    null,
    undefined,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])(
    'Given unsupported value %s, When validating it, Then it returns false without throwing',
    (value) => {
      expect(isValidInstant(value)).toBe(false);
    },
  );

  it.each([-1, { kind: 'instant', epochMilliseconds: 0 }])(
    'Given supported value %s, When validating it, Then it returns true',
    (value) => {
      expect(isValidInstant(value)).toBe(true);
    },
  );

  it('Given fractional epoch milliseconds, When validating it, Then it returns true because it is truncatable', () => {
    expect(isValidInstant(1.5)).toBe(true);
  });
});
