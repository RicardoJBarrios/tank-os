import { createServiceFactory } from '@ngneat/spectator/vitest';
import { createBigJsDecimalRuntime } from '@tankos/decimal-big-js';
import { DECIMAL_RUNTIME } from '../composition/decimal-runtime-token';
import { DecimalService } from './decimal-service';

describe('DecimalService', () => {
  const createService = createServiceFactory({
    service: DecimalService,
    providers: [
      { provide: DECIMAL_RUNTIME, useValue: createBigJsDecimalRuntime() },
    ],
  });

  it('uses the runtime configured by Angular composition', () => {
    const spectator = createService();

    expect(spectator.service.decimal('1.5').add('0.5').value).toBe('2');
    expect(spectator.service.context(2, 'half-up')).toEqual({
      decimalPlaces: 2,
      rounding: 'half-up',
    });
  });
});
