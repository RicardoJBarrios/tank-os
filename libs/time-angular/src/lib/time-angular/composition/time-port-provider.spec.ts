import { createServiceFactory } from '@ngneat/spectator/vitest';
import type { TimePort } from '@tankos/time';
import { TimeService } from '../application';
import { provideTimeClock, provideTimePort } from './index';

describe('time-port-provider', () => {
  const createService = createServiceFactory(TimeService);

  it('Given a replacement temporal port, When configuring Angular, Then TimeService uses it', () => {
    const timePort = {
      toUtcIsoString: () => 'provided-by-custom-port',
    } as unknown as TimePort;

    const spectator = createService({
      providers: [
        provideTimePort(timePort),
        provideTimeClock({
          now: () => ({ kind: 'instant', epochMilliseconds: 0 }),
        }),
      ],
    });

    expect(spectator.service.toUtcIsoString('2026-08-20T14:30:00Z')).toBe(
      'provided-by-custom-port',
    );
  });

  it('Given a replacement clock, When reading now, Then TimeService delegates to it', () => {
    const spectator = createService({
      providers: [
        provideTimePort({} as TimePort),
        provideTimeClock({
          now: () => ({ kind: 'instant', epochMilliseconds: 1234 }),
        }),
      ],
    });

    expect(spectator.service.now()).toEqual({
      kind: 'instant',
      epochMilliseconds: 1234,
    });
  });
});
