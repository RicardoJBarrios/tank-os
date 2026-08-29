import type { Instant } from '@tankos/time';

/** Reads the current JavaScript system clock as a normalized instant. */
export function dateIntlNow(): Instant {
  return { kind: 'instant', epochMilliseconds: Date.now() };
}
