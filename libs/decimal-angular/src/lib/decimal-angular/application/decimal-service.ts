import { inject, Injectable } from '@angular/core';
import { createDecimalContext, type DecimalInput, type Decimal } from '@tankos/decimal';
import { DECIMAL_RUNTIME } from '../composition/decimal-runtime-token';

/** Angular facade for the decimal runtime selected by application composition. */
@Injectable()
export class DecimalService {
  readonly #runtime = inject(DECIMAL_RUNTIME);

  /** Creates an immutable rounding context. */
  public readonly context = createDecimalContext;

  /** Creates an immutable Decimal value using the injected runtime. */
  public decimal(value: DecimalInput): Decimal {
    return this.#runtime.decimal(value);
  }
}
