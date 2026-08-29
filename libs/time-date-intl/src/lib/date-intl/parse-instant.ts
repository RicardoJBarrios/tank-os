import { truncateMilliseconds } from '@tankos/time';
import { Instant } from '@tankos/time';
import { parseInstantString } from './parse-instant-string';
import { parseStructuredInstant } from './parse-structured-instant';

/**
 * Parses an instant using the Date/Intl JavaScript runtime.
 *
 * @param value - An ISO instant, epoch milliseconds or previously parsed instant.
 * @returns The normalized instant value.
 * @throws `RangeError` when the input is not a valid instant.
 */
export function parseInstant(value: unknown): Instant {
  let epochMilliseconds: number;

  if (typeof value === 'string') {
    epochMilliseconds = parseInstantString(value);
  } else if (typeof value === 'number') {
    epochMilliseconds = truncateMilliseconds(value);
  } else {
    epochMilliseconds = parseStructuredInstant(value);
  }

  epochMilliseconds = truncateMilliseconds(epochMilliseconds);

  const date = new Date(epochMilliseconds);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Invalid instant');
  }

  return { kind: 'instant', epochMilliseconds };
}
