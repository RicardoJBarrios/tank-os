import { resolveLuxonLocalDateTime } from './resolve-luxon-local-date-time';
import { DateTime } from 'luxon';

it.each(['2026-03-08T02:30:00', '2026-11-01T01:30:00', '2026-08-20T24:00:00'])(
  'delegates DST and normalization to Luxon for %s',
  (value) => {
    expect(
      resolveLuxonLocalDateTime(value, 'America/New_York').epochMilliseconds,
    ).toBe(DateTime.fromISO(value, { zone: 'America/New_York' }).toMillis());
  },
);

it.each([
  ['2026-08-20T15:30', '2026-08-20T14:30:00.000Z'],
  ['2026-08-20T15:30:01.250', '2026-08-20T14:30:01.250Z'],
])('resolves local date-time %s with IANA zone rules', (value, expected) => {
  const instant = resolveLuxonLocalDateTime(value, 'Atlantic/Canary');
  expect(new Date(instant.epochMilliseconds).toISOString()).toBe(expected);
});

it.each([
  ['2026-08-20T25:00:00', 'UTC', /Invalid local date-time/u],
  ['2026-08-20T15:30:00', 'Not/A_Time_Zone', /Invalid time zone/u],
])('rejects unresolvable local value %s in %s', (value, zone, error) => {
  expect(() => resolveLuxonLocalDateTime(value, zone)).toThrow(error);
});
