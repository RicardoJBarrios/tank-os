import { z } from 'zod';
import type { TimeZoneDatabasePort } from '../core';

/** Creates the external-string schema for recognized IANA time zones. */
export function createZodTimeZoneSchema(
  timeZoneDatabase: TimeZoneDatabasePort,
): z.ZodType<string> {
  return z.string().superRefine((value, context) => {
    if (!timeZoneDatabase.isValid(value)) {
      context.addIssue({
        code: 'custom',
        message: `Invalid IANA time zone: ${value}`,
      });
    }
  });
}
