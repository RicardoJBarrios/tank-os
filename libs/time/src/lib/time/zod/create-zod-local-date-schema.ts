import { z } from 'zod';
import type { CalendarPort, LocalDate } from '../core';
import { parseWithZodContext } from './parse-with-zod-context';

/** Creates the external-string schema for zone-free calendar dates. */
export function createZodLocalDateSchema(
  calendarPort: CalendarPort,
): z.ZodType<LocalDate> {
  return z
    .string()
    .transform((value, context) =>
      parseWithZodContext(
        calendarPort.parseLocalDate.bind(calendarPort, value),
        'local date',
        context,
      ),
    );
}
