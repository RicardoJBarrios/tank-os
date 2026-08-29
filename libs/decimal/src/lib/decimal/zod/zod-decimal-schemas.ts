import type { z } from 'zod';
import type { DecimalContext, DecimalValue } from '../core';
import { createZodDecimalContextSchema } from './create-zod-decimal-context-schema';
import { createZodDecimalValueSchema } from './create-zod-decimal-value-schema';

/** Zod schemas for decimal values and decimal operation contexts. */
export interface ZodDecimalSchemas {
  readonly value: z.ZodType<DecimalValue>;
  readonly context: z.ZodType<DecimalContext>;
}

/** Composes the closed Zod boundary contract for Decimal. */
export function createZodDecimalSchemas(): ZodDecimalSchemas {
  return {
    value: createZodDecimalValueSchema(),
    context: createZodDecimalContextSchema(),
  };
}
