import { isZodExternalMessage } from './is-zod-external-message';

/** Returns a stable Zod issue message for any parser failure. */
export function zodParserErrorMessage(error: unknown, label: string): string {
  if (error instanceof Error && error.message) return error.message;
  const externalMessage = isZodExternalMessage(error) ? String(error) : '';
  return externalMessage || `Invalid ${label}`;
}
