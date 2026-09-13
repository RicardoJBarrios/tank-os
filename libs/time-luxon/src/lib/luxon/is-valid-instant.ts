import { parseInstant } from './parse-instant';
import type { InstantInput } from '@tankos/time';

/**
 * Checks whether a value can be parsed as an instant.
 *
 * @param value - The unknown value to validate.
 * @returns `true` when the value satisfies the instant input contract.
 */
export function isValidInstant(value: unknown): value is InstantInput {
  try {
    parseInstant(value);
    return true;
  } catch {
    return false;
  }
}
