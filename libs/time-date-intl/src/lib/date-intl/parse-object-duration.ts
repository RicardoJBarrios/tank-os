import { Duration, DurationInput, truncateMilliseconds } from '@tankos/time';
import { isValidDurationCandidate } from './is-valid-duration-candidate';

/** Parses and clones a structured duration object. */
export function parseObjectDuration(value: DurationInput & object): Duration {
  const candidate = value as Partial<Duration>;
  if (!isValidDurationCandidate(candidate))
    throw new RangeError('Invalid duration');
  return {
    kind: 'duration',
    milliseconds: truncateMilliseconds(candidate.milliseconds),
  };
}
