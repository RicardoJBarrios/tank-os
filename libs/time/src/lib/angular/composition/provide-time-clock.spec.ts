import type { ClockPort } from '@tankos/time';
import { TIME_CLOCK } from '../application';
import { provideTimeClock } from './provide-time-clock';

it('provides the selected clock by identity', () => {
  const clock = {} as ClockPort;
  expect(provideTimeClock(clock)).toEqual({
    provide: TIME_CLOCK,
    useValue: clock,
  });
});
