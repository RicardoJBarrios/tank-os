import {
  createServiceFactory,
  SpectatorService,
} from '@ngneat/spectator/vitest';
import { provideTimeAngularTestRuntime } from '../../../test-setup';
import { TemporalCalculationService } from './temporal-calculation-service';

describe('temporal-calculation-service', () => {
  let spectator: SpectatorService<TemporalCalculationService>;
  const createService = createServiceFactory({
    service: TemporalCalculationService,
    providers: [provideTimeAngularTestRuntime()],
  });

  beforeEach(() => (spectator = createService()));

  it('Given two instants, When calculating duration through Angular, Then it returns elapsed milliseconds', () => {
    expect(spectator.service.durationBetween(0, 1_000)).toEqual({
      kind: 'duration',
      milliseconds: 1_000,
    });
  });

  it('Given an instant and duration, When adding through Angular, Then it returns the shifted instant', () => {
    expect(spectator.service.addDuration(0, 1_000)).toEqual({
      kind: 'instant',
      epochMilliseconds: 1_000,
    });
  });

  it('Given two instants and durations, When comparing through Angular, Then it returns their ordering', () => {
    const service = spectator.service;

    expect(service.compareInstants(0, 1)).toBe(-1);
    expect(service.compareDurations('PT1S', 1_000)).toBe(0);
  });

  it('Given interval boundaries, When creating and querying through Angular, Then it supports containment and clamping', () => {
    const service = spectator.service;
    const interval = service.createInterval(0, 1_000);

    expect(service.contains(interval, 500)).toBe(true);
    expect(service.clamp(2_000, interval)).toEqual({
      kind: 'instant',
      epochMilliseconds: 1_000,
    });
  });

  it('Given a local date and calendar period, When adding through Angular, Then it preserves calendar semantics', () => {
    expect(
      spectator.service.addLocalDate('2024-01-31', {
        months: 1,
      }),
    ).toEqual({ kind: 'local-date', year: 2024, month: 2, day: 29 });
  });

  it('Given two local dates, When calculating their calendar duration through Angular, Then it returns whole days', () => {
    expect(
      spectator.service.durationBetweenLocalDates('2026-08-20', '2026-08-23'),
    ).toEqual({ kind: 'duration', milliseconds: 259_200_000 });
  });
});
