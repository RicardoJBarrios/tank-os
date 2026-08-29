import { Timestamp } from 'firebase/firestore';
import {
  Instant,
  InstantInput,
  LocalDate,
  LocalDateInput,
  CalendarPort,
  DurationPort,
  InstantPort,
  Duration,
  DurationInput,
} from '@tankos/time';
import { fromFirestoreDuration } from './from-firestore-duration';
import { fromFirestoreLocalDate } from './from-firestore-local-date';
import { fromFirestoreTimestamp } from './from-firestore-timestamp';
import { toFirestoreDuration } from './to-firestore-duration';
import { toFirestoreLocalDate } from './to-firestore-local-date';
import { toFirestoreTimestamp } from './to-firestore-timestamp';

/** Firestore representation used for a normalized TankOS instant. */
export type FirestoreInstant = Timestamp;

/** Firestore representation used for a duration, in integer milliseconds. */
export type FirestoreDuration = number;

/** Adapter for temporal values stored in Firestore documents. */
export interface FirestoreTimeAdapter {
  toTimestamp(value: InstantInput): FirestoreInstant;
  fromTimestamp(value: unknown): Instant;
  toLocalDate(value: LocalDateInput): string;
  fromLocalDate(value: unknown): LocalDate;
  toDuration(value: DurationInput): FirestoreDuration;
  fromDuration(value: unknown): Duration;
}

/**
 * Creates a Firestore temporal adapter backed by the active time port.
 *
 * @param timePort - Runtime implementation used to validate and normalize
 * temporal values.
 * @returns A Firestore conversion adapter.
 */
export function createFirestoreTimeAdapter(
  timePort: CalendarPort & DurationPort & InstantPort,
): FirestoreTimeAdapter {
  return {
    toTimestamp: toFirestoreTimestamp.bind(undefined, timePort),
    fromTimestamp: fromFirestoreTimestamp.bind(undefined, timePort),
    toLocalDate: toFirestoreLocalDate.bind(undefined, timePort),
    fromLocalDate: fromFirestoreLocalDate.bind(undefined, timePort),
    toDuration: toFirestoreDuration.bind(undefined, timePort),
    fromDuration: fromFirestoreDuration.bind(undefined, timePort),
  };
}
