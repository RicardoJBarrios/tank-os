import type { DecimalArithmeticPort } from '../core/ports';
import type { Decimal, DecimalInput } from '../core/value-types';

/** Coherent decimal capability selected by an application composition root. */
export interface DecimalRuntime {
  /** Arithmetic implementation used by all values created from this runtime. */
  readonly arithmetic: DecimalArithmeticPort;
  /** Creates an immutable decimal value bound to the selected arithmetic port. */
  readonly decimal: (value: DecimalInput) => Decimal;
}
