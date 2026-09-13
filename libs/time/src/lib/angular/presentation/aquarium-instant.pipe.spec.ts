import {
  createServiceFactory,
  SpectatorService,
} from '@ngneat/spectator/vitest';
import {
  provideTimeDisplayAdapter,
  provideTimeDisplayContext,
} from '../composition';
import { AquariumInstantPipe } from './aquarium-instant.pipe';

describe('aquarium-instant.pipe', () => {
  const formatInstant = vi.fn().mockReturnValue('aquarium instant');
  let spectator: SpectatorService<AquariumInstantPipe>;
  const createPipe = createServiceFactory(AquariumInstantPipe);

  beforeEach(() => {
    formatInstant.mockClear();
    spectator = createPipe({
      providers: [
        provideTimeDisplayContext({
          aquariumTimeZone: 'Atlantic/Canary',
          userTimeZone: 'Europe/Madrid',
        }),
        provideTimeDisplayAdapter({
          formatInstant,
          formatLocalDate: () => 'date',
          formatDuration: () => 'duration',
          formatHumanizedDuration: () => 'relative',
        }),
      ],
    });
  });

  it.each([null, undefined])(
    'Given absent value %s, When transforming it, Then it returns an empty string',
    (value) => {
      const pipe = spectator.service;

      expect(pipe.transform(value)).toBe('');
    },
  );

  it('Given an instant without options, When transforming it, Then it uses the aquarium zone', () => {
    const pipe = spectator.service;

    expect(pipe.transform(0)).toBe('aquarium instant');
    expect(formatInstant).toHaveBeenCalledWith(0, {
      timeZone: 'Atlantic/Canary',
    });
  });

  it('Given format, locale and options, When transforming it, Then explicit arguments win', () => {
    const pipe = spectator.service;

    expect(
      pipe.transform(0, 'full', 'es-ES', {
        format: 'medium',
        locale: 'en-US',
      }),
    ).toBe('aquarium instant');
    expect(formatInstant).toHaveBeenCalledWith(0, {
      format: 'full',
      locale: 'es-ES',
      timeZone: 'Atlantic/Canary',
    });
  });
});
