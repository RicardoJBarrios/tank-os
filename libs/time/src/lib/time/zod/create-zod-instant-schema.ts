import { z } from 'zod';
import type { Instant, InstantPort } from '../core';
import { parseWithZodContext } from './parse-with-zod-context';

/** Creates the external-string schema for normalized instants. */
export function createZodInstantSchema(
  instantPort: InstantPort,
): z.ZodType<Instant> {
  return z
    .string()
    .transform((value, context) =>
      parseWithZodContext(
        instantPort.parseInstant.bind(instantPort, value),
        'instant',
        context,
      ),
    );
}
