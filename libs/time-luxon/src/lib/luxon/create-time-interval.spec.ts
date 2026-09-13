import { createInterval } from './create-time-interval';

describe('createInterval', () => {
  it('composes a normalized closed interval', () => {
    expect(createInterval('1970-01-01T00:00:00Z', 1_000)).toEqual({
      start: { kind: 'instant', epochMilliseconds: 0 },
      end: { kind: 'instant', epochMilliseconds: 1_000 },
    });
  });
});
