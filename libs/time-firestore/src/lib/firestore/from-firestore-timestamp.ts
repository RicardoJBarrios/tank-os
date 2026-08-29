import {
  Instant,
  InstantPort,
  truncateTimestampMilliseconds,
} from '@tankos/time';
import { firestoreTimestampSchema } from './firestore-schemas';

/** Validates and converts a Firestore timestamp to a normalized instant. */
export function fromFirestoreTimestamp(
  timePort: InstantPort,
  value: unknown,
): Instant {
  const parsed = firestoreTimestampSchema.safeParse(value);
  if (!parsed.success) {
    throw new RangeError('Expected a Firestore Timestamp');
  }
  const timestamp = parsed.data;
  return timePort.parseInstant(
    truncateTimestampMilliseconds(timestamp.seconds, timestamp.nanoseconds),
  );
}
