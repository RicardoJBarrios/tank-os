import { DecimalError } from './decimal-error';

/** Indicates that an arithmetic result exceeds Decimal contract limits. */
export class DecimalRangeError extends DecimalError {
  /** Creates a result-range error for the delegated operation. */
  public constructor(operation: string) {
    super(
      'DECIMAL_RANGE_EXCEEDED',
      `Decimal result exceeds the supported range during ${operation}`,
    );
    this.name = 'DecimalRangeError';
  }
}
