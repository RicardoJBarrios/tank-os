import { DecimalError } from './decimal-error';

/** Indicates that a decimal operation context is invalid. */
export class DecimalContextError extends DecimalError {
  /** Creates a context-validation error. */
  public constructor(message: string) {
    super('INVALID_DECIMAL_CONTEXT', message);
    this.name = 'DecimalContextError';
  }
}
