import { CalendarPeriod } from '@tankos/time';
import { isValidCalendarPeriodValue } from './is-valid-calendar-period-value';

/** Asserts that an input is a calendar period with safe integer fields. */
export function validateCalendarPeriod(
  period: CalendarPeriod | null,
): asserts period is CalendarPeriod {
  if (period === null || typeof period !== 'object')
    throw new RangeError('Invalid calendar period');
  for (const value of [period.years, period.months, period.days]) {
    if (value !== undefined && !isValidCalendarPeriodValue(value))
      throw new RangeError('Calendar period values must be safe integers');
  }
}
