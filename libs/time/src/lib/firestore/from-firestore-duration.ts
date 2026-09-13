import { Duration, DurationPort } from '@tankos/time';
import { firestoreDurationSchema } from './firestore-schemas';

/** Validates and converts Firestore duration milliseconds. */
export function fromFirestoreDuration(
  timePort: DurationPort,
  value: unknown,
): Duration {
  const parsed = firestoreDurationSchema.safeParse(value);
  if (!parsed.success) {
    throw new RangeError('Expected finite duration milliseconds');
  }
  return timePort.parseDuration(parsed.data);
}
