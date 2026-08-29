import { isValidInstantParts } from './is-valid-instant-parts';

it.each([
  [2026, 8, 20, 23, 59, 59, 23, 59, true],
  [2026, 2, 29, 0, 0, 0, 0, 0, false],
  [2026, 8, 20, 24, 0, 0, 0, 0, false],
  [2026, 8, 20, 0, 60, 0, 0, 0, false],
  [2026, 8, 20, 0, 0, 60, 0, 0, false],
  [2026, 8, 20, 0, 0, 0, 24, 0, false],
  [2026, 8, 20, 0, 0, 0, 0, 60, false],
  [2026, 8, 20, -1, 0, 0, 0, 0, false],
  [2026, 8, 20, 0, -1, 0, 0, 0, false],
  [2026, 8, 20, 0, 0, -1, 0, 0, false],
  [2026, 8, 20, 0, 0, 0, -1, 0, false],
  [2026, 8, 20, 0, 0, 0, 0, -1, false],
] as const)(
  'validates instant components',
  (
    year,
    month,
    day,
    hour,
    minute,
    second,
    offsetHours,
    offsetMinutes,
    expected,
  ) => {
    expect(
      isValidInstantParts(
        year,
        month,
        day,
        hour,
        minute,
        second,
        offsetHours,
        offsetMinutes,
      ),
    ).toBe(expected);
  },
);
