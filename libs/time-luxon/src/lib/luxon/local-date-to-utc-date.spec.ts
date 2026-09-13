import { localDateToUtcDate } from './local-date-to-utc-date';

it.each([
  [1, 1, 2, '0001-01-02T00:00:00.000Z'],
  [2026, 8, 20, '2026-08-20T00:00:00.000Z'],
] as const)('anchors local date %s-%s-%s', (year, month, day, expected) => {
  expect(
    localDateToUtcDate({ kind: 'local-date', year, month, day }).toISO(),
  ).toBe(expected);
});
