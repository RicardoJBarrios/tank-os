import { Provider } from '@angular/core';
import { TimeRuntime } from '@tankos/time';
import { provideTimePort } from './provide-time-port';
import { provideTimeClock } from './provide-time-clock';
import { provideTimeZoneDatabase } from './provide-time-zone-database';
import { provideAngularTimeDisplayAdapter } from './provide-angular-time-display-adapter';

/** Wires an application-selected temporal runtime into Angular. */
export function provideTimeAngular(runtime: TimeRuntime): Provider[] {
  return [
    provideTimePort(runtime.timePort),
    provideTimeZoneDatabase(runtime.timeZoneDatabase),
    provideTimeClock(runtime.clock),
    provideAngularTimeDisplayAdapter(),
  ];
}
