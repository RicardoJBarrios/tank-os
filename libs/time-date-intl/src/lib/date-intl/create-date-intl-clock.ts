import { ClockPort } from '@tankos/time';
import { dateIntlNow } from './date-intl-now';

/** Creates a clock backed by the JavaScript runtime clock. */
export function createDateIntlClock(): ClockPort {
  return {
    now: dateIntlNow,
  };
}
