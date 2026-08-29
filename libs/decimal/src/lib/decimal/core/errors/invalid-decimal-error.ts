import { DecimalError } from './decimal-error';

/** Indicates that an input is not a supported finite decimal. */
export class InvalidDecimalError extends DecimalError {
  /** Creates an invalid-input error. */
  public constructor(value: unknown) {
    super('INVALID_DECIMAL', `Invalid decimal input: ${String(value)}`);
    this.name = 'InvalidDecimalError';
  }
}
