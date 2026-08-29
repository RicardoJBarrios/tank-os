import {
  createServiceFactory,
  SpectatorService,
} from '@ngneat/spectator/vitest';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { provideTimeDisplayContext } from '../composition';
import { TimeDisplayService } from './time-display-service';

describe('time-display-service', () => {
  const context: { aquariumTimeZone?: string; userTimeZone?: string } = {};
  let spectator: SpectatorService<TimeDisplayService>;
  const createService = createServiceFactory({
    service: TimeDisplayService,
    providers: [
      provideTimeAngularTestRuntime(),
      provideTimeDisplayContext(context),
    ],
  });

  beforeEach(() => {
    context.aquariumTimeZone = undefined;
    context.userTimeZone = undefined;
    spectator = createService();
  });

  it('Given an instant, When formatting it through Angular, Then it returns a display string', () => {
    expect(
      spectator.service.formatInstant('2026-08-20T15:30:00Z', {
        locale: 'en-US',
      }),
    ).toContain('Aug 20, 2026');
  });

  it.each([0, { kind: 'instant', epochMilliseconds: 0 }])(
    'Given supported instant value %s, When formatting it through Angular, Then it returns a display string',
    (value) => {
      expect(
        spectator.service.formatInstant(value as never, {
          locale: 'en-US',
        }),
      ).toContain('1970');
    },
  );

  it('Given a local date, When formatting it through Angular, Then it preserves the calendar date', () => {
    expect(
      spectator.service.formatLocalDate('2026-08-20', {
        locale: 'en-US',
        format: 'longDate',
      }),
    ).toContain('August 20, 2026');
  });

  it('Given a structured local date, When formatting it through Angular, Then it preserves the calendar date', () => {
    expect(
      spectator.service.formatLocalDate({
        kind: 'local-date',
        year: 2026,
        month: 8,
        day: 20,
      }),
    ).toContain('Aug 20, 2026');
  });

  it('Given a duration, When formatting it through Angular, Then it returns a localized display string', () => {
    expect(
      spectator.service.formatDuration(5_400_000, {
        locale: 'en-US',
      }),
    ).toBe('1 hr, 30 min');
  });

  it('Given a duration, When humanizing it through Angular, Then it returns localized relative text', () => {
    expect(
      spectator.service.formatHumanizedDuration(7_200_000, {
        locale: 'en-US',
      }),
    ).toBe('in 2 hours');
  });

  it('Given aquarium and user zones, When selecting the aquarium intent, Then the aquarium zone wins', () => {
    context.aquariumTimeZone = 'Europe/Madrid';
    context.userTimeZone = 'Pacific/Honolulu';

    expect(
      spectator.service.formatInstantForAquarium('2026-08-20T22:30:00Z', {
        format: 'yyyy-MM-dd HH:mm',
      }),
    ).toBe('2026-08-21 00:30');
  });

  it('Given no aquarium zone, When selecting the aquarium intent, Then it falls back to the user zone', () => {
    context.userTimeZone = 'Pacific/Honolulu';

    expect(
      spectator.service.formatInstantForAquarium('2026-08-20T22:30:00Z', {
        format: 'yyyy-MM-dd HH:mm',
      }),
    ).toBe('2026-08-20 12:30');
  });

  it('Given no display context, When selecting the aquarium intent, Then it falls back to UTC', () => {
    expect(
      spectator.service.formatInstantForAquarium('2026-08-20T22:30:00Z', {
        format: 'yyyy-MM-dd HH:mm',
      }),
    ).toBe('2026-08-20 22:30');
  });

  it('Given a user zone, When selecting the user intent, Then it uses that zone', () => {
    context.userTimeZone = 'Pacific/Honolulu';

    expect(
      spectator.service.formatInstantForUser('2026-08-20T22:30:00Z', {
        format: 'yyyy-MM-dd HH:mm',
      }),
    ).toBe('2026-08-20 12:30');
  });

  it('Given no display context, When selecting the user intent, Then it falls back to UTC', () => {
    expect(
      spectator.service.formatInstantForUser('2026-08-20T22:30:00Z', {
        format: 'yyyy-MM-dd HH:mm',
      }),
    ).toBe('2026-08-20 22:30');
  });
});
