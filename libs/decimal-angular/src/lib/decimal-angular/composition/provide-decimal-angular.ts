import type { Provider } from '@angular/core';
import type { DecimalRuntime } from '@tankos/decimal';
import { DecimalService } from '../application';
import { DECIMAL_RUNTIME } from './decimal-runtime-token';

/** Registers Decimal runtime and Angular facade at the chosen injector scope. */
export function provideDecimalAngular(runtime: DecimalRuntime): Provider[] {
  return [
    { provide: DECIMAL_RUNTIME, useValue: runtime },
    { provide: DecimalService, useClass: DecimalService },
  ];
}
