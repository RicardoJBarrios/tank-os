import { createInterval } from './create-time-interval';
import { contains } from './time-interval-contains';

describe('contains', () => {
  const interval = createInterval(0, 1_000);

  it.each([0, 500, 1_000])('contains inclusive value %s', (value) => {
    expect(contains(interval, value)).toBe(true);
  });

  it.each([-1, 1_001])('excludes outside value %s', (value) => {
    expect(contains(interval, value)).toBe(false);
  });
});
