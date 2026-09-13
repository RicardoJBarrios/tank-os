import { Timestamp } from 'firebase/firestore';

/** Narrows a value to the Firestore client Timestamp representation. */
export function isFirestoreTimestamp(value: unknown): value is Timestamp {
  return value instanceof Timestamp;
}
