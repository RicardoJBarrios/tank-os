import { z } from 'zod';
import { normalizeDecimalInput, type DecimalValue } from '../core';

/** Creates the Zod schema for a canonical transport decimal string. */
export function createZodDecimalValueSchema(): z.ZodType<DecimalValue> {
  return z.string().transform((value, context) => {
    try {
      return normalizeDecimalInput(value);
    } catch (error) {
      context.addIssue({ code: 'custom', message: String(error) });
      return z.NEVER;
    }
  });
}
