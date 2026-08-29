import { Provider } from '@angular/core';
import { TimePort } from '@tankos/time';
import { TIME_PORT } from '../application';

/** Registers the complete temporal port for Angular consumers. */
export function provideTimePort(timePort: TimePort): Provider {
  return { provide: TIME_PORT, useValue: timePort };
}
