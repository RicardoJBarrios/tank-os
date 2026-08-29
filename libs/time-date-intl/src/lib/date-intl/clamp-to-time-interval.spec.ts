import { clamp } from './clamp-to-time-interval';
import { createInterval } from './create-time-interval';

describe('clamp', () => {
  it.each([
    [-1, 0],
    [500, 500],
    [1_001, 1_000],
  ] as const)('clamps value %s to %s', (value, expected) => {
    expect(clamp(value, createInterval(0, 1_000))).toEqual({
      kind: 'instant',
      epochMilliseconds: expected,
    });
  });
});
