import {
  createServiceFactory,
  SpectatorService,
} from '@ngneat/spectator/vitest';
import {
  provideTimeDisplayAdapter,
  provideTimeDisplayContext,
} from '../composition';
import { UserInstantPipe } from './user-instant.pipe';

describe('user-instant.pipe', () => {
  const formatInstant = vi.fn().mockReturnValue('user instant');
  let spectator: SpectatorService<UserInstantPipe>;
  const createPipe = createServiceFactory(UserInstantPipe);

  beforeEach(() => {
    formatInstant.mockClear();
    spectator = createPipe({
      providers: [
        provideTimeDisplayContext({ userTimeZone: 'Pacific/Honolulu' }),
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

  it('Given an instant without options, When transforming it, Then it uses the user zone', () => {
    const pipe = spectator.service;

    expect(pipe.transform(0)).toBe('user instant');
    expect(formatInstant).toHaveBeenCalledWith(0, {
      timeZone: 'Pacific/Honolulu',
    });
  });

  it('Given format, locale and options, When transforming it, Then explicit arguments win', () => {
    const pipe = spectator.service;

    expect(
      pipe.transform(0, 'full', 'es-ES', {
        format: 'medium',
        locale: 'en-US',
      }),
    ).toBe('user instant');
    expect(formatInstant).toHaveBeenCalledWith(0, {
      format: 'full',
      locale: 'es-ES',
      timeZone: 'Pacific/Honolulu',
    });
  });
});
