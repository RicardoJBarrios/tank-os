import {
  createServiceFactory,
  SpectatorService,
} from '@ngneat/spectator/vitest';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { TimeService } from './time-service';

const UTC_SUFFIX_PATTERN = /Z$/u;
const DURATION_PREFIX_PATTERN = /^-?P/u;

describe('time-service', () => {
  let spectator: SpectatorService<TimeService>;
  const createService = createServiceFactory({
    service: TimeService,
    providers: [provideTimeAngularTestRuntime()],
  });

  beforeEach(() => (spectator = createService()));

  it('Given an ISO instant, When parsing it through Angular, Then it returns an Instant', () => {
    expect(spectator.service.parseInstant('2026-08-20T15:30:00Z')).toEqual({
      kind: 'instant',
      epochMilliseconds: Date.parse('2026-08-20T15:30:00.000Z'),
    });
  });

  it.each([0, -1, { kind: 'instant', epochMilliseconds: 0 }])(
    'Given supported instant value %s, When parsing it through Angular, Then it returns an Instant',
    (value) => {
      expect(spectator.service.parseInstant(value as never)).toEqual({
        kind: 'instant',
        epochMilliseconds: value === -1 ? -1 : 0,
      });
    },
  );

  it.each([
    'not-an-instant',
    '',
    null,
    undefined,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])(
    'Given invalid instant value %s, When validating it through Angular, Then it returns false',
    (value) => {
      expect(spectator.service.isValidInstant(value)).toBe(false);
    },
  );

  it('Given an offset instant, When serializing it through Angular, Then it returns UTC ISO notation', () => {
    expect(spectator.service.toUtcIsoString('2026-08-20T15:30:00+01:00')).toBe(
      '2026-08-20T14:30:00.000Z',
    );
  });

  it.each([0, -1, { kind: 'instant', epochMilliseconds: 0 }])(
    'Given supported instant value %s, When serializing it through Angular, Then it returns UTC ISO notation',
    (value) => {
      expect(spectator.service.toUtcIsoString(value as never)).toMatch(
        UTC_SUFFIX_PATTERN,
      );
    },
  );

  it('Given a calendar date, When parsing it through Angular, Then it remains independent from time zones', () => {
    expect(spectator.service.parseLocalDate('2026-08-20')).toEqual({
      kind: 'local-date',
      year: 2026,
      month: 8,
      day: 20,
    });
  });

  it('Given an empty calendar date, When parsing it through Angular, Then it raises a range error', () => {
    expect(() => spectator.service.parseLocalDate('')).toThrow(RangeError);
  });

  it.each(['2026-02-29', '', null, undefined, 20260820])(
    'Given invalid calendar value %s, When validating it through Angular, Then it returns false',
    (value) => {
      expect(spectator.service.isValidLocalDate(value)).toBe(false);
    },
  );

  it('Given a local date-time and zone, When resolving it through Angular, Then it returns the corresponding instant', () => {
    expect(
      spectator.service.fromZonedDateTime(
        '2026-08-20T15:30:00',
        'Atlantic/Canary',
      ),
    ).toEqual({
      kind: 'instant',
      epochMilliseconds: Date.parse('2026-08-20T14:30:00.000Z'),
    });
  });

  it('Given a local date-time and zone, When resolving with origin through Angular, Then it retains the source zone metadata', () => {
    expect(
      spectator.service.resolveZonedDateTime(
        '2026-08-20T15:30:00',
        'Atlantic/Canary',
      ),
    ).toEqual({
      instant: {
        kind: 'instant',
        epochMilliseconds: Date.parse('2026-08-20T14:30:00.000Z'),
      },
      origin: {
        sourceTimeZone: 'Atlantic/Canary',
        resolvedOffsetMinutes: 60,
      },
    });
  });

  it('Given a local date-time and offset, When resolving with origin through Angular, Then it retains the source offset', () => {
    expect(
      spectator.service.resolveOffsetDateTime('2026-08-20T15:30:00', 60),
    ).toEqual({
      instant: {
        kind: 'instant',
        epochMilliseconds: Date.parse('2026-08-20T14:30:00.000Z'),
      },
      origin: {
        sourceOffsetMinutes: 60,
        resolvedOffsetMinutes: 60,
      },
    });
  });

  it.each([
    ['', 'Atlantic/Canary'],
    ['2026-08-20T15:30:00', ''],
  ])(
    'Given invalid zoned date-time value %s/%s, When resolving it through Angular, Then it raises a range error',
    (value, timeZone) => {
      expect(() =>
        spectator.service.fromZonedDateTime(value, timeZone),
      ).toThrow(RangeError);
    },
  );

  it.each(['Not/A_Time_Zone', '', '   ', ' UTC', 'UTC ', 'Europe/Pa✨ris'])(
    'Given invalid IANA zone %s, When validating it through Angular, Then it returns false',
    (timeZone) => {
      expect(spectator.service.isValidTimeZone(timeZone)).toBe(false);
    },
  );

  it('Given an elapsed duration, When parsing it through Angular, Then it returns normalized milliseconds', () => {
    expect(spectator.service.parseDuration('PT1H30M')).toEqual({
      kind: 'duration',
      milliseconds: 5_400_000,
    });
  });

  it.each([0, -1, { kind: 'duration', milliseconds: 1_500 }])(
    'Given supported duration value %s, When serializing it through Angular, Then it returns canonical ISO notation',
    (value) => {
      expect(spectator.service.toDurationIsoString(value as never)).toMatch(
        DURATION_PREFIX_PATTERN,
      );
    },
  );

  it.each([
    '',
    null,
    undefined,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
  ])(
    'Given invalid duration value %s, When validating it through Angular, Then it returns false',
    (value) => {
      expect(spectator.service.isValidDuration(value)).toBe(false);
    },
  );
});
