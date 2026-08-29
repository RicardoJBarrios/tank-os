import { createServiceFactory } from '@ngneat/spectator/vitest';
import { createBigJsDecimalRuntime } from '@tankos/decimal-big-js';
import { DecimalService } from '../application';
import { provideDecimalAngular } from './provide-decimal-angular';

describe('provideDecimalAngular', () => {
  const createService = createServiceFactory({
    service: DecimalService,
    providers: [provideDecimalAngular(createBigJsDecimalRuntime())],
  });

  it('registers the runtime and its Angular facade together', () => {
    expect(createService().service.decimal('2').multiply('3').value).toBe('6');
  });
});
