import { DurationInput, DurationPort } from '@tankos/time';

/** Converts a duration to integer milliseconds for Firestore. */
export function toFirestoreDuration(
  timePort: DurationPort,
  value: DurationInput,
): number {
  return timePort.parseDuration(value).milliseconds;
}
