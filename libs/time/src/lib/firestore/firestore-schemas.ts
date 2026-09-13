import type { Timestamp } from 'firebase/firestore';
import { z } from 'zod';
import { isFirestoreTimestamp } from './is-firestore-timestamp';

/** Runtime schema for a client Firestore timestamp. */
export const firestoreTimestampSchema = z.custom<Timestamp>(
  isFirestoreTimestamp,
  { message: 'Expected a Firestore Timestamp' },
);

/** Runtime schema for a canonical Firestore local-date string. */
export const firestoreLocalDateSchema = z.string();

/** Runtime schema for safely representable integer duration milliseconds. */
export const firestoreDurationSchema = z.number().int();
