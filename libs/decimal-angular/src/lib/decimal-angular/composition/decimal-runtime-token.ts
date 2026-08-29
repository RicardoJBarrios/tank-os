import { InjectionToken } from '@angular/core';
import type { DecimalRuntime } from '@tankos/decimal';

/** Injection token for the complete Decimal runtime. */
export const DECIMAL_RUNTIME = new InjectionToken<DecimalRuntime>(
  'TANKOS_DECIMAL_RUNTIME',
);
