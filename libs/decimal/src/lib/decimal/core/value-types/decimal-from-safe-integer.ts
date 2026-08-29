import { InvalidDecimalError } from '../errors';
import type { DecimalValue } from './decimal-value';

/** Converts an exactly representable JavaScript integer into a Decimal value. */
export function decimalFromSafeInteger(value: number): DecimalValue {
  if (!Number.isSafeInteger(value)) throw new InvalidDecimalError(value);
  return String(value) as DecimalValue;
}
