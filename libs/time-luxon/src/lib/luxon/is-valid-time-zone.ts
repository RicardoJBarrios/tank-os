import { IANAZone } from 'luxon';

/** Delegates zone identifier support to Luxon and the platform TZDB. */
export function isValidTimeZone(value: string): boolean {
  return IANAZone.isValidZone(value);
}
