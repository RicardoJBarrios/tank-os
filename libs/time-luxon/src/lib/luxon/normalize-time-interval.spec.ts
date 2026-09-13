import { normalizeTimeInterval } from './normalize-time-interval';

describe('normalizeTimeInterval', () => {
  it('normalizes every supported boundary representation', () => {
    expect(
      normalizeTimeInterval({
        start: '1970-01-01T00:00:00Z',
        end: 1_000,
      }),
    ).toEqual({
      start: { kind: 'instant', epochMilliseconds: 0 },
      end: { kind: 'instant', epochMilliseconds: 1_000 },
    });
  });

  it.each([
    null,
    {},
    { start: 1_000, end: 0 },
    { start: 'invalid', end: 1_000 },
  ])('rejects invalid interval %s', (interval) => {
    expect(() => normalizeTimeInterval(interval as never)).toThrow(RangeError);
  });
});
