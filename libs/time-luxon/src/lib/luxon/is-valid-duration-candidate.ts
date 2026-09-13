import { Duration } from '@tankos/time';

/** Narrows a partial object to a structured safe duration. */
export function isValidDurationCandidate(
  candidate: Partial<Duration>,
): candidate is Duration {
  return (
    candidate.kind === 'duration' &&
    typeof candidate.milliseconds === 'number' &&
    Number.isSafeInteger(Math.trunc(candidate.milliseconds))
  );
}
