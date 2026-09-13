import {
  createServiceFactory,
  SpectatorService,
} from '@ngneat/spectator/vitest';
import { provideTimeDisplayAdapter } from '../composition';
import { LocalDatePipe } from './local-date.pipe';

describe('local-date.pipe', () => {
  const formatLocalDate = vi.fn().mockReturnValue('20 August 2026');
  const adapter = {
    formatInstant: () => '20 Aug 2026',
    formatLocalDate,
    formatDuration: () => '1 hr',
    formatHumanizedDuration: () => 'in 1 hour',
  };
  let spectator: SpectatorService<LocalDatePipe>;
  const createPipe = createServiceFactory(LocalDatePipe);

  beforeEach(() => {
    formatLocalDate.mockReset().mockReturnValue('20 August 2026');
    spectator = createPipe({
      providers: [provideTimeDisplayAdapter(adapter)],
    });
  });

  it.each([
    '2026-08-20',
    { kind: 'local-date', year: 2026, month: 8, day: 20 },
    '',
  ] as const)(
    'Given supported local date value %s, When transforming it, Then it delegates to temporal display',
    (value) => {
      const pipe = spectator.service;

      expect(pipe.transform(value)).toBe('20 August 2026');
    },
  );

  it('Given no local date, When transforming it, Then it returns an empty string', () => {
    const pipe = spectator.service;

    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('Given format and locale arguments, When transforming a local date, Then it forwards them without a time zone', () => {
    formatLocalDate.mockReturnValue('formatted');
    const pipe = spectator.service;

    expect(
      pipe.transform('2026-08-20', 'fullDate', 'es-ES', {
        format: 'longDate',
      }),
    ).toBe('formatted');
    expect(formatLocalDate).toHaveBeenCalledWith('2026-08-20', {
      format: 'fullDate',
      locale: 'es-ES',
    });
  });
});
