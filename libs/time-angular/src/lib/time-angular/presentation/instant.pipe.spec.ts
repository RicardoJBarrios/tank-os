import {
  createServiceFactory,
  SpectatorService,
} from '@ngneat/spectator/vitest';
import { provideTimeDisplayAdapter } from '../composition';
import { InstantPipe } from './instant.pipe';

describe('instant.pipe', () => {
  const formatInstant = vi.fn().mockReturnValue('20 Aug 2026');
  const adapter = {
    formatInstant,
    formatLocalDate: () => '20 August 2026',
    formatDuration: () => '1 hr',
    formatHumanizedDuration: () => 'in 1 hour',
  };
  let spectator: SpectatorService<InstantPipe>;
  const createPipe = createServiceFactory(InstantPipe);

  beforeEach(() => {
    formatInstant.mockReset().mockReturnValue('20 Aug 2026');
    spectator = createPipe({
      providers: [provideTimeDisplayAdapter(adapter)],
    });
  });

  it.each([
    '2026-08-20T15:30:00Z',
    0,
    { kind: 'instant', epochMilliseconds: 0 },
  ] as const)(
    'Given supported instant value %s, When transforming it, Then it delegates to temporal display',
    (value) => {
      const pipe = spectator.service;

      expect(pipe.transform(value)).toBe('20 Aug 2026');
    },
  );

  it('Given no instant, When transforming it, Then it returns an empty string', () => {
    const pipe = spectator.service;

    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('Given DatePipe-compatible arguments, When transforming an instant, Then it forwards them to the display service', () => {
    formatInstant.mockReturnValue('formatted');
    const pipe = spectator.service;

    expect(
      pipe.transform(0, 'full', 'Atlantic/Canary', 'es-ES', {
        format: 'medium',
      }),
    ).toBe('formatted');
    expect(formatInstant).toHaveBeenCalledWith(0, {
      format: 'full',
      timeZone: 'Atlantic/Canary',
      locale: 'es-ES',
    });
  });
});
