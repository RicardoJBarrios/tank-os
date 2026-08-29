import type { DecimalArithmeticPort } from '../core/ports';
import { createDecimal } from './create-decimal';
import type { DecimalRuntime } from './decimal-runtime';

/** Creates a decimal runtime from a replaceable arithmetic implementation. */
export function createDecimalRuntime(
  arithmetic: DecimalArithmeticPort,
): DecimalRuntime {
  return { arithmetic, decimal: (value) => createDecimal(value, arithmetic) };
}
