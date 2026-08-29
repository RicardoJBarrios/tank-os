import type { TimePort } from '@tankos/time';
import { TIME_PORT } from '../application';
import { provideTimePort } from './provide-time-port';

it('provides the selected temporal port by identity', () => {
  const port = {} as TimePort;
  expect(provideTimePort(port)).toEqual({ provide: TIME_PORT, useValue: port });
});
