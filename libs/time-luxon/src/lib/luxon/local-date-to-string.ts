import type { LocalDateInput } from '@tankos/time';
import { localDateToUtcDate } from './local-date-to-utc-date';

/** Serializes a civil date using Luxon's ISO calendar representation. */
export function toLocalDateString(value: LocalDateInput): string {
  return String(localDateToUtcDate(value).toISODate());
}
