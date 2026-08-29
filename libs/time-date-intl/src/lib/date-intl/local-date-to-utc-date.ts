import { LocalDate } from '@tankos/time';

/** Anchors a zone-free local date at UTC midnight without year coercion. */
export function localDateToUtcDate(value: LocalDate): Date {
  const date = new Date(0);
  date.setUTCFullYear(value.year, value.month - 1, value.day);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}
