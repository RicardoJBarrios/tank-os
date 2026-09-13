import { ClockPort } from '@tankos/time';
import { luxonNow } from './luxon-now';

/** Creates a clock backed by Luxon. */
export function createLuxonClock(): ClockPort {
  return {
    now: luxonNow,
  };
}
