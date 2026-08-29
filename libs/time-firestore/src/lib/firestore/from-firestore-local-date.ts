import { CalendarPort, LocalDate } from '@tankos/time';
import { firestoreLocalDateSchema } from './firestore-schemas';

/** Validates and converts a Firestore local-date string. */
export function fromFirestoreLocalDate(
  timePort: CalendarPort,
  value: unknown,
): LocalDate {
  const parsed = firestoreLocalDateSchema.safeParse(value);
  if (!parsed.success) {
    throw new RangeError('Expected a Firestore local date string');
  }
  return timePort.parseLocalDate(parsed.data);
}
