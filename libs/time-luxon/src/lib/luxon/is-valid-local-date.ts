import { LocalDateInput } from '@tankos/time';
import { parseLocalDate } from './parse-local-date';

/**
 * Checks whether a value is a valid local calendar date.
 *
 * @param value - The unknown value to validate.
 * @returns `true` when the value is a valid `YYYY-MM-DD` date.
 */
export function isValidLocalDate(value: unknown): value is LocalDateInput {
  try {
    parseLocalDate(value);
    return true;
  } catch {
    return false;
  }
}
