import { Provider } from '@angular/core';
import { TIME_DISPLAY_ADAPTER } from '../application';
import { TimeDisplayAdapter } from '../contracts';

/** Registers a custom temporal display adapter for Angular consumers. */
export function provideTimeDisplayAdapter(
  adapter: TimeDisplayAdapter,
): Provider {
  return { provide: TIME_DISPLAY_ADAPTER, useValue: adapter };
}
