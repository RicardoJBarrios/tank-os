import { Duration, DurationInput } from '@tankos/time';
import { truncateMilliseconds } from '@tankos/time';
import { fractionToMilliseconds } from './fraction-to-milliseconds';
import { parseIsoDurationParts } from './parse-iso-duration-parts';
import { parseNumericDuration } from './parse-numeric-duration';
import { parseObjectDuration } from './parse-object-duration';

const DURATION_PATTERN = /^[\x2b\x2d]?P(?:\d+D)?(?:T.*)?$/u;
const MILLISECONDS_PER_SECOND = 1_000;
const MILLISECONDS_PER_MINUTE = 60 * MILLISECONDS_PER_SECOND;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;

/** Parses a duration into a new normalized millisecond value. */
export function parseDuration(value: DurationInput): Duration {
  if (typeof value === 'number') {
    return parseNumericDuration(value);
  }

  if (typeof value === 'object') {
    return parseObjectDuration(value);
  }

  const match = DURATION_PATTERN.exec(value);
  if (!match) {
    throw new RangeError('Invalid ISO 8601 duration');
  }

  const parts = parseIsoDurationParts(value);
  if (!parts) {
    throw new RangeError('Invalid ISO 8601 duration');
  }

  const milliseconds =
    parts.days * MILLISECONDS_PER_DAY +
    parts.hours * MILLISECONDS_PER_HOUR +
    parts.minutes * MILLISECONDS_PER_MINUTE +
    parts.seconds * MILLISECONDS_PER_SECOND +
    fractionToMilliseconds(parts.fraction);
  const signedMilliseconds = value.startsWith('-')
    ? -milliseconds
    : milliseconds;

  return {
    kind: 'duration',
    milliseconds: truncateMilliseconds(signedMilliseconds),
  };
}
