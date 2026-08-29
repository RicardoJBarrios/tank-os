import { createDecimalRuntime, type DecimalRuntime } from '@tankos/decimal';
import { createBigJsDecimalAdapter } from './big-js-decimal-adapter';

/** Creates the complete Decimal runtime backed by Big.js. */
export function createBigJsDecimalRuntime(): DecimalRuntime {
  return createDecimalRuntime(createBigJsDecimalAdapter());
}
