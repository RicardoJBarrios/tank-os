import { z } from 'zod';
import {
  createDecimalContext,
  ROUNDING_MODES,
  type DecimalContext,
} from '../core';

/** Creates the Zod schema for an immutable decimal rounding context. */
export function createZodDecimalContextSchema(): z.ZodType<DecimalContext> {
  return z
    .strictObject({
      decimalPlaces: z.number(),
      rounding: z.enum(ROUNDING_MODES),
    })
    .transform((value, context) => {
      try {
        return createDecimalContext(value.decimalPlaces, value.rounding);
      } catch (error) {
        context.addIssue({ code: 'custom', message: String(error) });
        return z.NEVER;
      }
    });
}
