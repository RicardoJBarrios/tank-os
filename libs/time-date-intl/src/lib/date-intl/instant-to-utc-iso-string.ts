import { parseInstant } from './parse-instant';
import { InstantInput } from '@tankos/time';

/**
 * Serializes an instant as an ISO 8601 UTC string.
 *
 * @param value - The instant to serialize.
 * @returns A UTC ISO string with millisecond precision.
 * @throws `RangeError` when the input is invalid.
 */
export function toUtcIsoString(value: InstantInput): string {
  return new Date(parseInstant(value).epochMilliseconds).toISOString();
}
