/** Base error for the Decimal public boundary. */
export class DecimalError extends Error {
  /** Stable error code for boundary mapping. */
  public readonly code: string;

  /** Creates a typed decimal error. */
  public constructor(code: string, message: string) {
    super(message);
    this.name = 'DecimalError';
    this.code = code;
  }
}
