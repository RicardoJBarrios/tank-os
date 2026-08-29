import { resolveDateIntlLocalDateTime } from './resolve-date-intl-local-date-time';

it.each([
  ['2026-08-20T15:30', '2026-08-20T14:30:00.000Z'],
  ['2026-08-20T15:30:01.250', '2026-08-20T14:30:01.250Z'],
])('resolves local date-time %s with IANA zone rules', (value, expected) => {
  const instant = resolveDateIntlLocalDateTime(value, 'Atlantic/Canary');
  expect(new Date(instant.epochMilliseconds).toISOString()).toBe(expected);
});

it.each([
  ['2026-03-08T02:30:00', 'America/New_York', /does not exist/u],
  ['2026-11-01T01:30:00', 'America/New_York', /ambiguous/u],
  ['2026-08-20T24:00:00', 'UTC', /Invalid local date-time/u],
  ['2026-08-20T15:30:00', 'Not/A_Time_Zone', /Invalid time zone/u],
])('rejects unresolvable local value %s in %s', (value, zone, error) => {
  expect(() => resolveDateIntlLocalDateTime(value, zone)).toThrow(error);
});
