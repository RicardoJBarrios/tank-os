import { toDurationIsoString } from './duration-to-iso-string';

describe('duration-to-iso-string', () => {
  it.each([
    [0, 'PT0S'],
    [86_400_000, 'PT86400S'],
    [90_061_001, 'PT90061.001S'],
    [3_600_000, 'PT3600S'],
    [1_000, 'PT1S'],
    [-1500, 'PT-1.5S'],
    ['PT1M', 'PT60S'],
    [{ kind: 'duration', milliseconds: 60_000 }, 'PT60S'],
  ])(
    'Given a duration %s, When serializing it, Then it returns %s',
    (value, expected) => {
      expect(toDurationIsoString(value as never)).toBe(expected);
    },
  );
});
