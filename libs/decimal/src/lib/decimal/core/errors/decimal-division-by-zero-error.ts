import { DecimalError } from './decimal-error';

/** Indicates that an operation attempted to divide a decimal by zero. */
export class DecimalDivisionByZeroError extends DecimalError {
  /** Creates a division-by-zero error. */
  public constructor() {
    super('DECIMAL_DIVISION_BY_ZERO', 'Cannot divide a decimal by zero');
    this.name = 'DecimalDivisionByZeroError';
  }
}
