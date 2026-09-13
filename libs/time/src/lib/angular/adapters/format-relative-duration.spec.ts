import { formatRelativeDuration } from './format-relative-duration';

describe('formatRelativeDuration', () => {
  it.each([
    [0, 'now'],
    [30_000, 'in 30 seconds'],
    [-120_000, '2 minutes ago'],
    [7_200_000, 'in 2 hours'],
  ] as const)('formats %s as %s', (value, expected) => {
    expect(formatRelativeDuration(value, 'en-US', 'none')).toBe(expected);
  });
  it('uses calendar units only when explicitly approximate', () => {
    expect(
      formatRelativeDuration(60 * 86_400_000, 'en-US', 'approximate'),
    ).toBe('in 2 months');
  });
  it('falls back to exact units below one approximate month', () => {
    expect(formatRelativeDuration(30_000, 'en-US', 'approximate')).toBe(
      'in 30 seconds',
    );
  });
});
