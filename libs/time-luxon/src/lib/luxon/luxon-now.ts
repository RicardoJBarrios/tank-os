import { DateTime } from 'luxon';
import type { Instant } from '@tankos/time';

/** Gets the current instant from Luxon's clock (Settings.now in tests). */
export function luxonNow(): Instant {
  return { kind: 'instant', epochMilliseconds: DateTime.now().toMillis() };
}
