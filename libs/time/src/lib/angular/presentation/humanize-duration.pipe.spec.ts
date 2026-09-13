import {
  createServiceFactory,
  SpectatorService,
} from '@ngneat/spectator/vitest';
import { provideTimeDisplayAdapter } from '../composition';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { HumanizeDurationPipe } from './humanize-duration.pipe';

describe('humanize-duration.pipe', () => {
  let spectator: SpectatorService<HumanizeDurationPipe>;
  const createPipe = createServiceFactory(HumanizeDurationPipe);

  it.each([
    7_200_000,
    'PT2H',
    { kind: 'duration', milliseconds: 7_200_000 },
  ] as const)(
    'Given duration value %s, When humanizing it, Then it delegates to relative display',
    (value) => {
      const formatHumanizedDuration = vi.fn().mockReturnValue('in 2 hours');
      spectator = createPipe({
        providers: [
          provideTimeDisplayAdapter({
            formatInstant: () => 'instant',
            formatLocalDate: () => 'date',
            formatDuration: () => 'duration',
            formatHumanizedDuration,
          }),
        ],
      });
      const pipe = spectator.service;

      expect(pipe.transform(value, { locale: 'en-US' })).toBe('in 2 hours');
      expect(formatHumanizedDuration).toHaveBeenCalledWith(value, {
        locale: 'en-US',
      });
    },
  );

  it('Given no duration, When humanizing it, Then it returns an empty string', () => {
    spectator = createPipe({
      providers: [
        provideTimeDisplayAdapter({
          formatInstant: () => 'instant',
          formatLocalDate: () => 'date',
          formatDuration: () => 'relative',
          formatHumanizedDuration: () => 'relative',
        }),
      ],
    });
    const pipe = spectator.service;

    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('Given approximate calendar units, When humanizing a long duration, Then it forwards the option', () => {
    const formatHumanizedDuration = vi.fn().mockReturnValue('in 2 months');
    spectator = createPipe({
      providers: [
        provideTimeDisplayAdapter({
          formatInstant: () => 'instant',
          formatLocalDate: () => 'date',
          formatDuration: () => 'duration',
          formatHumanizedDuration,
        }),
      ],
    });
    const pipe = spectator.service;

    expect(
      pipe.transform(60 * 86_400_000, { calendarUnits: 'approximate' }),
    ).toBe('in 2 months');
    expect(formatHumanizedDuration).toHaveBeenCalledWith(60 * 86_400_000, {
      calendarUnits: 'approximate',
    });
  });

  it('Given the Angular composition, When humanizing with an explicit locale, Then it returns localized relative text', () => {
    spectator = createPipe({
      providers: [...provideTimeAngularTestRuntime()],
    });
    const pipe = spectator.service;

    expect(pipe.transform(7_200_000, { locale: 'es-ES' })).toBe(
      'dentro de 2 horas',
    );
  });
});
