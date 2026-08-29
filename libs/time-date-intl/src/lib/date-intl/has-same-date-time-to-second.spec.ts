import { hasSameDateTimeToSecond } from './has-same-date-time-to-second';

describe('hasSameDateTimeToSecond', () => {
  const parts = {
    year: 2026,
    month: 8,
    day: 20,
    hour: 15,
    minute: 30,
    second: 1,
    millisecond: 123,
  };

  it('accepts equal fields and deliberately ignores milliseconds', () => {
    expect(hasSameDateTimeToSecond(parts, { ...parts })).toBe(true);
    expect(hasSameDateTimeToSecond(parts, { ...parts, millisecond: 999 })).toBe(
      true,
    );
  });

  it.each(['year', 'month', 'day', 'hour', 'minute', 'second'] as const)(
    'detects a difference in %s',
    (field) => {
      expect(
        hasSameDateTimeToSecond(parts, {
          ...parts,
          [field]: parts[field] + 1,
        }),
      ).toBe(false);
    },
  );
});
