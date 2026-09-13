import { createServiceFactory } from '@ngneat/spectator/vitest';
import { LOCALE_ID } from '@angular/core';
import {
  provideAngularTimeDisplayAdapter,
  provideTimeDisplayAdapter,
  provideTimeDisplayContext,
} from './index';
import { TimeDisplayService } from '../application';
import { provideTimeAngularTestRuntime } from '../../../test-setup';

describe('time-display-provider', () => {
  const createService = createServiceFactory(TimeDisplayService);

  it('Given an Angular locale, When configuring the default display provider, Then DatePipe formats with that locale', () => {
    const spectator = createService({
      providers: [
        ...provideTimeAngularTestRuntime(),
        provideAngularTimeDisplayAdapter('UTC'),
        { provide: LOCALE_ID, useValue: 'en-US' },
      ],
    });

    expect(
      spectator.service.formatInstant(0, {
        format: 'shortDate',
        timeZone: 'UTC',
      }),
    ).toBe('1/1/70');
  });

  it('Given Angular LOCALE_ID, When configuring the display provider, Then that closed locale contract is used', () => {
    const spectator = createService({
      providers: [
        ...provideTimeAngularTestRuntime(),
        provideAngularTimeDisplayAdapter('UTC'),
        { provide: LOCALE_ID, useValue: 'en-US' },
      ],
    });

    expect(
      spectator.service.formatInstant(0, {
        format: 'longDate',
        timeZone: 'UTC',
      }),
    ).toBe('January 1, 1970');
  });

  it('Given a replacement display adapter, When configuring Angular, Then the display service uses it', () => {
    const adapter = {
      formatInstant: () => 'custom instant',
      formatLocalDate: () => 'custom date',
      formatDuration: () => 'custom duration',
      formatHumanizedDuration: () => 'custom relative duration',
    };

    const spectator = createService({
      providers: [
        ...provideTimeAngularTestRuntime(),
        provideTimeDisplayAdapter(adapter),
      ],
    });

    expect(spectator.service.formatInstant('2026-08-20T15:30:00Z')).toBe(
      'custom instant',
    );
  });

  it('Given the Angular display provider, When configuring Angular, Then the service uses DatePipe-backed formatting', () => {
    const spectator = createService({
      providers: [
        ...provideTimeAngularTestRuntime(),
        provideAngularTimeDisplayAdapter('UTC'),
      ],
    });

    expect(
      spectator.service.formatInstant(0, {
        format: 'short',
        timeZone: 'UTC',
      }),
    ).toContain('1/1/70');
  });

  it('Given an aquarium display zone, When no pipe zone is provided, Then the aquarium zone wins over the user zone', () => {
    const spectator = createService({
      providers: [
        ...provideTimeAngularTestRuntime(),
        provideTimeDisplayContext({
          aquariumTimeZone: 'Europe/Madrid',
          userTimeZone: 'Pacific/Honolulu',
        }),
        provideAngularTimeDisplayAdapter(),
      ],
    });

    expect(
      spectator.service.formatInstant('2026-08-20T22:30:00Z', {
        format: 'yyyy-MM-dd HH:mm',
      }),
    ).toBe('2026-08-21 00:30');
  });

  it('Given only a user display zone, When no pipe zone is provided, Then the user zone is used', () => {
    const spectator = createService({
      providers: [
        ...provideTimeAngularTestRuntime(),
        provideTimeDisplayContext({ userTimeZone: 'Pacific/Honolulu' }),
        provideAngularTimeDisplayAdapter(),
      ],
    });

    expect(
      spectator.service.formatInstant('2026-08-20T22:30:00Z', {
        format: 'yyyy-MM-dd HH:mm',
      }),
    ).toBe('2026-08-20 12:30');
  });
});
