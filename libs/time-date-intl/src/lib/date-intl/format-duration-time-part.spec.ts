import { formatDurationTimePart } from './format-duration-time-part';

it.each([
  [0, 0, 0, 0, 'T0S'],
  [1, 2, 3, 4, 'T1H2M3.004S'],
  [0, 2, 0, 0, 'T2M'],
  [0, 0, 0, 250, 'T0.25S'],
] as const)(
  'formats ISO time components',
  (hours, minutes, seconds, milliseconds, expected) => {
    expect(formatDurationTimePart(hours, minutes, seconds, milliseconds)).toBe(
      expected,
    );
  },
);
