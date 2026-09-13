import { Timestamp } from 'firebase/firestore';
import { InstantInput, InstantPort } from '@tankos/time';

/** Converts an instant input to Firestore's timestamp representation. */
export function toFirestoreTimestamp(
  timePort: InstantPort,
  value: InstantInput,
): Timestamp {
  return Timestamp.fromMillis(timePort.parseInstant(value).epochMilliseconds);
}
