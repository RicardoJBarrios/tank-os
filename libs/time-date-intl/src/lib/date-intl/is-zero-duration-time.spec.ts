import { isZeroDurationTime } from './is-zero-duration-time';

it.each([
  [0, 0, 0, 0, true],
  [1, 0, 0, 0, false],
  [0, 1, 0, 0, false],
  [0, 0, 1, 0, false],
  [0, 0, 0, 1, false],
] as const)(
  'checks zero time components',
  (hours, minutes, seconds, milliseconds, expected) => {
    expect(isZeroDurationTime(hours, minutes, seconds, milliseconds)).toBe(
      expected,
    );
  },
);
