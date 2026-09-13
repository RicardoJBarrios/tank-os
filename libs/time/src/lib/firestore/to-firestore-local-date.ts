import { CalendarPort, LocalDateInput } from '@tankos/time';

/** Converts a local date to its canonical Firestore string. */
export function toFirestoreLocalDate(
  timePort: CalendarPort,
  value: LocalDateInput,
): string {
  return timePort.toLocalDateString(value);
}
