import { z } from 'zod';
import { zodParserErrorMessage } from './zod-parser-error-message';

/** Maps a port parser exception into a Zod refinement issue. */
export function parseWithZodContext<T>(
  parser: () => T,
  label: string,
  context: z.RefinementCtx,
): T | typeof z.NEVER {
  try {
    return parser();
  } catch (error) {
    context.addIssue({
      code: 'custom',
      message: zodParserErrorMessage(error, label),
    });
    return z.NEVER;
  }
}
