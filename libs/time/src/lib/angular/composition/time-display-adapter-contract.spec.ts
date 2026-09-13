import { createServiceFactory } from '@ngneat/spectator/vitest';
import { vi } from 'vitest';
import { provideTimeDisplayAdapter } from './provide-time-display-adapter';
import { TimeDisplayAdapter } from '../contracts';
import { TimeDisplayService } from '../application';

describe('time-display-adapter contract', () => {
  const createService = createServiceFactory(TimeDisplayService);

  it('Given a custom display adapter, When the display service is used, Then every presentation capability is available', () => {
    const formatHumanizedDuration = vi
      .fn()
      .mockReturnValue('relative duration');
    const adapter: TimeDisplayAdapter = {
      formatInstant: vi.fn().mockReturnValue('instant'),
      formatLocalDate: vi.fn().mockReturnValue('local date'),
      formatDuration: vi.fn().mockReturnValue('duration'),
      formatHumanizedDuration,
    };
    const spectator = createService({
      providers: [provideTimeDisplayAdapter(adapter)],
    });
    const service = spectator.service;

    expect(service.formatInstant(0)).toBe('instant');
    expect(service.formatLocalDate('2026-08-20')).toBe('local date');
    expect(service.formatDuration(1_000)).toBe('duration');
    expect(service.formatHumanizedDuration(1_000)).toBe('relative duration');
    expect(formatHumanizedDuration).toHaveBeenCalledWith(1_000, undefined);
  });
});
