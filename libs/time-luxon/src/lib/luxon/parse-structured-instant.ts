import { truncateMilliseconds } from '@tankos/time';
import {
  isValidStructuredInstant,
  StructuredInstantCandidate,
} from './is-valid-structured-instant';

/** Parses a structured instant into normalized epoch milliseconds. */
export function parseStructuredInstant(value: unknown): number {
  const candidate = value as StructuredInstantCandidate;
  if (!isValidStructuredInstant(candidate))
    throw new RangeError('Invalid instant');
  return truncateMilliseconds(candidate.epochMilliseconds);
}
