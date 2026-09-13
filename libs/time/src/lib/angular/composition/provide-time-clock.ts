import { Provider } from '@angular/core';
import { ClockPort } from '@tankos/time';
import { TIME_CLOCK } from '../application';

/** Registers the selected clock for temporal services. */
export function provideTimeClock(clock: ClockPort): Provider {
  return { provide: TIME_CLOCK, useValue: clock };
}
