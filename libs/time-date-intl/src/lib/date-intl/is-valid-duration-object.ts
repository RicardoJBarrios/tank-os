import { Duration } from '@tankos/time';
import { isValidDurationMilliseconds } from './is-valid-duration-milliseconds';

/** Narrows a candidate to a structured duration object. */
export function isValidDurationObject(value: unknown): value is Duration {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Duration>;
  return (
    candidate.kind === 'duration' &&
    isValidDurationMilliseconds(candidate.milliseconds)
  );
}
