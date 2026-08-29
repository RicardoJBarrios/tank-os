import { DateTimeParts } from '@tankos/time';

/** Compares calendar and clock fields through seconds, ignoring milliseconds. */
export function hasSameDateTimeToSecond(
  left: DateTimeParts,
  right: DateTimeParts,
): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day &&
    left.hour === right.hour &&
    left.minute === right.minute &&
    left.second === right.second
  );
}
