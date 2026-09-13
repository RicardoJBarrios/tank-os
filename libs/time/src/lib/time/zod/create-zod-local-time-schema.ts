import { z } from 'zod';
import { parseLocalTime, type LocalTime } from '../core';
import { parseWithZodContext } from './parse-with-zod-context';

/** Creates the external string boundary for zone-free civil clock times. */
export function createZodLocalTimeSchema(): z.ZodType<LocalTime> {
  return z
    .string()
    .transform((value, context) =>
      parseWithZodContext(() => parseLocalTime(value), 'local time', context),
    );
}
