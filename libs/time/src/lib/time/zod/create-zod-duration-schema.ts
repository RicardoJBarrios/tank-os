import { z } from 'zod';
import type { Duration, DurationPort } from '../core';
import { parseWithZodContext } from './parse-with-zod-context';

/** Creates the external-string schema for elapsed durations. */
export function createZodDurationSchema(
  durationPort: DurationPort,
): z.ZodType<Duration> {
  return z
    .string()
    .transform((value, context) =>
      parseWithZodContext(
        durationPort.parseDuration.bind(durationPort, value),
        'duration',
        context,
      ),
    );
}
