import { DecimalError } from './decimal-error';

/** Indicates that a configured arithmetic adapter failed at its boundary. */
export class DecimalAdapterError extends DecimalError {
  /** Operation delegated to the adapter. */
  public readonly operation: string;

  /** Creates an adapter-boundary error without leaking provider semantics. */
  public constructor(operation: string) {
    super(
      'DECIMAL_ADAPTER_FAILURE',
      `Decimal adapter failed during ${operation}`,
    );
    this.name = 'DecimalAdapterError';
    this.operation = operation;
  }
}
