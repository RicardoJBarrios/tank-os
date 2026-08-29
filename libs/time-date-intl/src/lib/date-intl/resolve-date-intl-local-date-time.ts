import type { Instant } from '@tankos/time';
import { createUtcTimestamp } from './create-utc-timestamp';
import { getCandidateTimeZoneOffsets } from './get-candidate-time-zone-offsets';
import { getLocalDateTimeParts } from './get-local-date-time-parts';
import { hasSameDateTimeToSecond } from './has-same-date-time-to-second';
import { isValidTimeZone } from './is-valid-time-zone';
import { parseLocalDateTime } from './parse-local-date-time';

/** Resolves a local date-time uniquely using the runtime Intl time-zone rules. */
export function resolveDateIntlLocalDateTime(
  value: string,
  timeZone: string,
): Instant {
  if (!isValidTimeZone(timeZone)) {
    throw new RangeError(`Invalid time zone: ${String(timeZone)}`);
  }

  const localParts = parseLocalDateTime(value);
  const localAsUtc = createUtcTimestamp(localParts);
  const candidates = new Set<number>();

  for (const offset of getCandidateTimeZoneOffsets(localAsUtc, timeZone)) {
    const candidate = localAsUtc - offset;
    const candidateParts = getLocalDateTimeParts(candidate, timeZone);
    if (hasSameDateTimeToSecond(candidateParts, localParts)) {
      candidates.add(candidate);
    }
  }

  if (candidates.size === 0) {
    throw new RangeError(
      `Local date-time does not exist in ${timeZone}: ${value}`,
    );
  }
  if (candidates.size > 1) {
    throw new RangeError(`Local date-time is ambiguous in ${timeZone}: ${value}`);
  }

  return { kind: 'instant', epochMilliseconds: [...candidates][0] };
}
