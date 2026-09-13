import { DurationInput } from '@tankos/time';
import { parseDuration } from './parse-duration';
import { isValidDurationObject } from './is-valid-duration-object';

/** Returns whether a duration input is a normalized safe millisecond value. */
export function isValidDuration(value: unknown): value is DurationInput {
  if (typeof value === 'number') {
    return Number.isSafeInteger(Math.trunc(value));
  }

  if (typeof value === 'string') {
    try {
      parseDuration(value);
      return true;
    } catch {
      return false;
    }
  }

  return isValidDurationObject(value);
}
