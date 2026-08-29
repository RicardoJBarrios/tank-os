/** Narrows failures that have safe primitive stringification. */
export function isZodExternalMessage(
  error: unknown,
): error is string | number | boolean | bigint {
  return ['string', 'number', 'boolean', 'bigint'].includes(typeof error);
}
